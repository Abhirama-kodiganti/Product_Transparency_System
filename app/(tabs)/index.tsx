import { Feather, Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import openfoodfacts from '../../openfoodfacts_india.json';

// Pretty name mapping for categories
const CATEGORY_PRETTY_NAMES: Record<string, string> = {
  biscuits: 'Biscuits',
  chocolates: 'Chocolates',
  'carbonated drinks': 'Carbonated Drinks',
  dairies: 'Dairies',
  'instant-noodles': 'Instant Noodles',
  snacks: 'Snacks',
  'breakfast-cereals': 'Breakfast Cereals',
  cakes: 'Cakes',
  'dry-fruits': 'Dry Fruits',
  meats: 'Meats',
  rices: 'Rices',
  teas: 'Teas',
  coffees: 'Coffees',
  'dietary-supplements': 'Dietary Supplements',
  soups: 'Soups',
  spices: 'Spices',
  sauces: 'Sauces',
  oils: 'Oils',
  'baby-foods': 'Baby Foods',
};

// Placeholder image for new categories
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/120x120.png?text=Food';

export default function HomeScreen() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    setCategories(Object.keys(openfoodfacts));
  }, []);

  const handleScanPress = () => {
    Alert.alert(
      'Choose Scan Type',
      'What would you like to do?',
      [
        {
          text: 'Camera',
          onPress: () => router.push('/camera'),
        },
        {
          text: 'Scan Barcode',
          onPress: () => router.push('/barcode-scanner'),
        },
        {
          text: 'Manual Input',
          onPress: () => router.push('/manual-barcode'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.userName}>Abhiram</Text>
            <Text style={styles.welcomeText}>Welcome to Really</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.profileContainer}>
              <View style={styles.avatar}>
                <Feather name="user" size={24} color="#6366f1" />
              </View>
              <View style={styles.planBadge}>
                <Text style={styles.planText}>Basic</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="Search for Packaged Foods" placeholderTextColor="#999" />
        </View>

        {/* Category Tabs */}
        <View style={styles.categoryTabsContainer}>
          <TouchableOpacity style={[styles.categoryTab, styles.activeCategoryTab]}>
            <Text style={[styles.categoryTabText, styles.activeCategoryTabText]}>Food</Text>
          </TouchableOpacity>
          <Link href="/medicine" asChild>
            <TouchableOpacity style={styles.categoryTab}>
              <Text style={styles.categoryTabText}>Medicine</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/cosmetics" asChild>
            <TouchableOpacity style={styles.categoryTab}>
              <Text style={styles.categoryTabText}>Cosmetics</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Featured Card */}
        <View style={[styles.featuredCard ]}>
          <View style={styles.featuredContent}>
            <View style={styles.featuredText}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                <Text style={styles.featuredTitle}>Food</Text>
              </View>
              <Text style={styles.featuredDescription}>Tap to explore {"\n"}foods.</Text>
              <TouchableOpacity style={styles.knowMoreButton}>
                <Text style={styles.knowMoreText}>Know More</Text>
                <Ionicons name="chevron-forward" size={16} color="#6366f1" />
              </TouchableOpacity>
            </View>
            <View style={styles.featuredImageContainer}>
              <Image source={{ uri: "https://i.pinimg.com/736x/4b/28/a1/4b28a146bad6e2e0c294de7f318b79a1.jpg" }} style={styles.productImage} />
              
            </View>
          </View>
        </View>

        {/* Top-rated Healthy Picks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top-rated Healthy Picks</Text>
          <View style={styles.picksContainer}>
            <View style={styles.pickCard}>
              <View>
                <Text style={styles.pickTitle}>Mindful{"\n"}Munch</Text>
              </View>
              <Image source={{ uri: "https://i.pinimg.com/736x/5b/d2/8d/5bd28d8ed2974ead4058328e85070c1d.jpg" }} style={styles.pickImage} />
            </View>
            <View style={styles.pickCard}>
              <View>
                <Text style={styles.pickTitle}>Feel-Good{"\n"}Sips</Text>
              </View>
              <Image source={{ uri: "https://i.pinimg.com/736x/12/a3/17/12a317d5fb945877fd7a6ee99037ea7e.jpg" }} style={styles.pickImage} />
            </View>
          </View>
        </View>

        {/* All Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Categories</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.categoriesGrid}>
              {categories.map((catKey) => {
                const prettyName = CATEGORY_PRETTY_NAMES[catKey] || catKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                // Use existing images for known categories, else placeholder
                const imageMap: Record<string, string> = {
                  biscuits: 'https://i.pinimg.com/736x/8a/c1/af/8ac1af98cae35cad039f198c07e18d52.jpg',
                  chocolates: 'https://i.pinimg.com/736x/98/05/ba/9805ba59e3a7e7e5bd206db1fbd0fc22.jpg',
                  'Carbonated drinks': 'https://i.pinimg.com/736x/68/da/1e/68da1ee88260795007a012089d4e0f20.jpg',
                  dairies: 'https://i.pinimg.com/736x/82/1d/6c/821d6c6e7d451f902fc8b00b70376ab8.jpg',
                  'instant-noodles': 'https://i.pinimg.com/736x/a0/00/a3/a000a3ef09fdc66543f52452eb25a177.jpg',
                  snacks: 'https://i.pinimg.com/736x/ee/2c/31/ee2c31e44ffb3a23919651bb88b18493.jpg',
                  cakes: 'https://i.pinimg.com/736x/1e/51/71/1e517173fd4ae12404e5c4a0a7d5a34a.jpg',
                  'dry-fruits': 'https://i.pinimg.com/736x/69/fe/61/69fe61881877e16b144b3e1ff4b5d209.jpg',
                  meats: 'https://i.pinimg.com/736x/ba/95/11/ba9511393ee20b62a7b4b33bfc244c1e.jpg',
                  rices: 'https://i.pinimg.com/736x/31/38/1c/31381ce7c94e70ab2d5ad2b9603724d7.jpg',
                  teas: 'https://i.pinimg.com/736x/29/29/a2/2929a2a06d03ef310aca48037e70486d.jpg',
                  coffees : 'https://i.pinimg.com/736x/d8/49/a4/d849a419c843976b5f76c664a9cd1846.jpg',
                  'breakfast-cereals' : 'https://i.pinimg.com/736x/1f/82/13/1f82134163392fe7905dc52096a22af3.jpg',
                  'dietary-supplements':'https://i.pinimg.com/736x/c5/98/47/c598471f1143e3a9b81d922531a1f8a8.jpg',
                  'soups':'https://i.pinimg.com/736x/52/ea/6c/52ea6cbd13bf295f61cb4fb789c76d47.jpg',
                  'baby-foods': 'https://i.pinimg.com/736x/b7/bf/eb/b7bfeba2991e6e68dfb32b806fe04d1e.jpg',
                  'spices':'https://i.pinimg.com/736x/9c/ff/11/9cff11bf12c4592fce88efb3acd71900.jpg',
                  'sauces': 'https://i.pinimg.com/736x/02/75/cb/0275cb73be1ac1ba35c98f061a82a639.jpg',
                  'oils':'https://i.pinimg.com/736x/dc/66/f1/dc66f17d09cd9bb2ba881dd4523cd20d.jpg',
                  
                  
                };
                const image = imageMap[catKey] || PLACEHOLDER_IMAGE;
                return (
                  <Link key={catKey} href={{ pathname: "/category", params: { category: catKey } }} asChild>
                    <TouchableOpacity style={styles.categoryItem}>
                      <Image source={{ uri: image }} style={styles.categoryImage} />
                      <Text style={styles.categoryLabel}>{prettyName}</Text>
                    </TouchableOpacity>
                  </Link>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="home" size={24} color="#6366f1" />
          <Text style={[styles.tabLabel, styles.activeTab]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="search" size={24} color="#666" />
          <Text style={styles.tabLabel}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.scanButton} onPress={handleScanPress}>
          <Ionicons name="scan" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="cloud-upload-outline" size={24} color="#666" />
          <Text style={styles.tabLabel}>Upload</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="list-outline" size={24} color="#666" />
          <Text style={styles.tabLabel}>Shop List</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerLeft: {
    flex: 1,
  },
  userName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 16,
    color: "#666",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  profileContainer: {
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  planBadge: {
    backgroundColor: "#10d9c4",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  planText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  categoryTabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    padding: 5,
  },
  categoryTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  activeCategoryTab: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  activeCategoryTabText: {
    color: "#000",
  },
  featuredCard: {
    marginHorizontal: 10,
    backgroundColor: "#FFA500",
    borderRadius: 20,
    padding: 10,
    marginBottom: 30,
    borderColor: "#ffffff",
  },
  featuredContent: {
    flexDirection: "row",
  },
  featuredText: {
    flex: 1,
    marginRight: 10,
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  featuredSubtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  featuredDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 15,
  },
  knowMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#6366f1",
    alignSelf: "flex-start",
  },
  knowMoreText: {
    color: "#6366f1",
    fontWeight: "bold",
    marginRight: 5,
  },
  featuredImageContainer: {
    flex: 0.8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    height: 120,
  },
  productImage1: {
    width: 80,
    height: 80,
    borderRadius: 8,
    position: "absolute",
    left: 0,
    zIndex: 1,
    transform: [{ rotate: "-10deg" }],
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 15,
    position: "absolute",
    right: 0,
    left: 69.9,
    bottom : 40
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    marginHorizontal: 20,
  },
  picksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  pickCard: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 5,
  },
  pickTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    lineHeight: 22,
  },
  pickImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  categoryItem: {
    alignItems: "center",
    marginBottom: 18,
    width: '30%',
    marginHorizontal: '1.5%',
  },
  categoryImage: {
    width: 70,
    height: 70,
    borderRadius: 15,
  },
  categoryLabel: {
    marginTop: 6,
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
    textAlign: "center",
  },
  bottomSpacing: {
    height: 100,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    alignItems: "center",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 12,
    color: "#666",
  },
  activeTab: {
    color: "#6366f1",
    fontWeight: "bold",
  },
  scanButton: {
    width: 70,
    height: 70,
    backgroundColor: "#6366f1",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    bottom: 20,
    borderWidth: 5,
    borderColor: "#ffffff",
  },
})
