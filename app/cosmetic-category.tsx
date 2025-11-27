import { Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";

export default function CosmeticCategoryScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category) {
      setLoading(true);
      // Open Beauty Facts category search
      const categoryMap: Record<string, string> = {
        'hair-care': 'hair-care',
        'skin-care': 'skin-care',
        'body-care': 'body-care',
        'all-up-glam': 'makeup',
      };
      
      const searchCategory = categoryMap[category] || category;
      fetch(`https://world.openbeautyfacts.org/cgi/search.pl?action=process&tagtype_0=categories&tag_contains_0=contains&tag_0=${encodeURIComponent(searchCategory)}&page_size=20&json=true`)
        .then(res => res.json())
        .then(data => {
          setProducts(data.products || []);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching cosmetics:', err);
          setProducts([]);
          setLoading(false);
        });
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [category]);

  const getCategoryDisplayName = (cat: string) => {
    const names: Record<string, string> = {
      'hair-care': 'Hair Care',
      'skin-care': 'Skin Care',
      'body-care': 'Body Care',
      'all-up-glam': 'Makeup',
    };
    return names[cat] || cat;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getCategoryDisplayName(category || '')}</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Main Content */}
        <View style={styles.mainContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Sort Header */}
            <Text style={styles.sortText}>Sorted by Rating (High to low)</Text>

            {/* Products Grid */}
            <View style={styles.productsGrid}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#fc8eac" />
                  <Text style={styles.loadingText}>Loading products...</Text>
                </View>
              ) : products.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No products found.</Text>
                </View>
              ) : (
                products.map((product, index) => (
                  <Link 
                    key={index} 
                    href={{ pathname: "/cosmetic-product" as any, params: { barcode: product.code } }} 
                    asChild
                  >
                    <TouchableOpacity style={styles.productCard}>
                      {product.image_front_url ? (
                        <View style={{ alignItems: 'center' }}>
                          <Image 
                            source={{ uri: product.image_front_url }} 
                            style={{ width: 80, height: 80, borderRadius: 8, marginBottom: 8 }} 
                          />
                        </View>
                      ) : (
                        <View style={styles.placeholderImage}>
                          <Ionicons name="image-outline" size={40} color="#ccc" />
                        </View>
                      )}
                      <Text style={styles.productName} numberOfLines={2}>
                        {product.product_name || product.name || 'Unknown Product'}
                      </Text>
                      <Text style={styles.productBrand} numberOfLines={1}>
                        {product.brands || 'Unknown Brand'}
                      </Text>
                      {product.quantity && (
                        <Text style={styles.productVariant} numberOfLines={1}>
                          {product.quantity}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </Link>
                ))
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  searchButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 15,
  },
  sortText: {
    fontSize: 14,
    color: "#999",
    marginBottom: 15,
    marginTop: 15,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    lineHeight: 18,
  },
  productBrand: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  productVariant: {
    fontSize: 12,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
  },
});

