import { Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CategoryScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category) {
      setLoading(true);
      fetch(`https://in.openfoodfacts.org/category/${category}.json`)
        .then(res => res.json())
        .then(data => {
          setProducts(data.products || []);
          setLoading(false);
        });
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [category]);

  const biscuitTypes = [
    "Plain, Sweet Biscuits",
    "Sandwich Biscuits",
    "Wafers",
    "Traditional sweet biscuits",
    "Savory Biscuits",
    "Filled Biscuits",
    "Low Sugar",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category}</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {biscuitTypes.map((type, index) => (
              <TouchableOpacity key={index} style={styles.sidebarItem}>
                <View style={[styles.sidebarIcon, { backgroundColor: index === 0 ? "#ff6b35" : "#e0e0e0" }]} />
                <Text style={[styles.sidebarText, index === 0 && styles.activeSidebarText]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Filters */}
            <View style={styles.filtersContainer}>
              <Text style={styles.filtersText}>Filters (0)</Text>
              <Ionicons name="options-outline" size={20} color="#333" />
            </View>

            {/* Upgrade Banner */}
            <View style={styles.upgradeCard}>
              <Text style={styles.upgradeTitle}>Get personalised insights that fit you.</Text>
              <TouchableOpacity style={styles.upgradeButton}>
                <Text style={styles.upgradeButtonText}>Unlock Really Plus</Text>
              </TouchableOpacity>
            </View>

            {/* Sort Header */}
            <Text style={styles.sortText}>Sorted by Rating (High to low)</Text>

            {/* Products Grid */}
            <View style={styles.productsGrid}>
              {loading ? (
                <Text>Loading...</Text>
              ) : products.length === 0 ? (
                <Text>No products found.</Text>
              ) : (
                products.map((product, index) => (
                  <Link key={index} href={{ pathname: "/product", params: { barcode: product.code } }} asChild>
                    <TouchableOpacity style={styles.productCard}>
                      {product.image_front_url ? (
                        <View style={{ alignItems: 'center' }}>
                          <Image source={{ uri: product.image_front_url }} style={{ width: 80, height: 80, borderRadius: 8, marginBottom: 8 }} />
                        </View>
                      ) : null}
                      <Text style={styles.productName}>{product.product_name || product.name}</Text>
                      <Text style={styles.productBrand}>{product.brands}</Text>
                      <Text style={styles.productVariant}>{product.quantity}</Text>
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
    flexDirection: "row",
  },
  sidebar: {
    width: 120,
    backgroundColor: "#f8f9fa",
    paddingVertical: 10,
  },
  sidebarItem: {
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  sidebarIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginBottom: 8,
  },
  sidebarText: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
    lineHeight: 14,
  },
  activeSidebarText: {
    color: "#333",
    fontWeight: "600",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 15,
  },
  filtersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  filtersText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  upgradeCard: {
    backgroundColor: "#8b5cf6",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  upgradeTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  upgradeButton: {
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  upgradeButtonText: {
    color: "#8b5cf6",
    fontWeight: "600",
    textAlign: "center",
  },
  sortText: {
    fontSize: 14,
    color: "#999",
    marginBottom: 15,
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
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    lineHeight: 18,
  },
  productBrand: {
    fontSize: 12,
    color: "#666",
  },
  productVariant: {
    fontSize: 12,
    color: "#666",
  },
}); 