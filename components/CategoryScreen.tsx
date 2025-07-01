import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from "react-native"

interface CategoryScreenProps {
  category: string
  onBack: () => void
  onProductSelect: () => void
}

export default function CategoryScreen({ category, onBack, onProductSelect }: CategoryScreenProps) {
  const biscuitTypes = [
    "Plain, Sweet Biscuits",
    "Sandwich Biscuits",
    "Wafers",
    "Traditional sweet biscuits",
    "Savory Biscuits",
    "Filled Biscuits",
    "Low Sugar",
  ]

  const products = [
    { name: "Bebe Burp Choco Multigrain Coo...", rating: "3.5", color: "#8b5cf6" },
    { name: "Bebe Burp Oats & Raisins Cookies", rating: "3.4", color: "#8b5cf6" },
    { name: "Ancient Roots Healthier Multi...", rating: "3.3", color: "#22c55e" },
    { name: "Ancient Roots Healthier Almo...", rating: "3.1", color: "#f59e0b" },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category}</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchIcon}>🔍</Text>
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
              <Text style={styles.filtersIcon}>⚙️</Text>
            </View>

            {/* Upgrade Banner */}
            <View style={styles.upgradeCard}>
              <Text style={styles.upgradeTitle}>Get personalised insights that fit you.</Text>
              <TouchableOpacity style={styles.upgradeButton}>
                <Text style={styles.upgradeButtonText}>Unlock TruthIn Plus</Text>
              </TouchableOpacity>
            </View>

            {/* Sort Header */}
            <Text style={styles.sortText}>Sorted by Rating (High to low)</Text>

            {/* Products Grid */}
            <View style={styles.productsGrid}>
              {products.map((product, index) => (
                <TouchableOpacity key={index} style={styles.productCard} onPress={onProductSelect}>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>{product.rating}</Text>
                  </View>
                  <View style={[styles.productImage, { backgroundColor: product.color }]} />
                  <Text style={styles.productName}>{product.name}</Text>
                  <View style={styles.productActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Text style={styles.heartIcon}>🤍</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Text style={styles.listIcon}>📋</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  )
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
  backArrow: {
    fontSize: 24,
    color: "#333",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  searchButton: {
    padding: 5,
  },
  searchIcon: {
    fontSize: 20,
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
  filtersIcon: {
    fontSize: 16,
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
  ratingBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#22c55e",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  ratingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  productImage: {
    width: "100%",
    height: 80,
    borderRadius: 8,
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    lineHeight: 18,
  },
  productActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    padding: 5,
  },
  heartIcon: {
    fontSize: 16,
  },
  listIcon: {
    fontSize: 16,
  },
})
