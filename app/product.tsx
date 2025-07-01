import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Linking, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProductDetailScreen() {
  const router = useRouter();

  const concernsData = [
    { icon: "🧪", name: "Additives", value: "1", color: "#f59e0b" },
    { icon: "⚡", name: "Energy", value: "459.7 kcal", color: "#f59e0b" },
    { icon: "🍯", name: "Total Sugars", value: "14.2 g", color: "#f59e0b" },
    { icon: "🥄", name: "Added Sugars", value: "7.1 g", color: "#f59e0b" },
    { icon: "🔥", name: "Saturated Fat", value: "10.0 g", color: "#ef4444" },
  ];

  const likesData = [
    { icon: "🌾", name: "Dietary Fiber", value: "4.3 g", color: "#22c55e" },
    { icon: "🚫", name: "Trans Fat", value: "0.0 g", color: "#22c55e" },
    { icon: "💊", name: "Cholesterol", value: "0.0 mg", color: "#22c55e" },
    { icon: "🧂", name: "Sodium", value: "168.9 mg", color: "#22c55e" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="share-social-outline" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Product Card */}
        <View style={styles.productCard}>
          <Text style={styles.productTitle}>
            Bebe Burp Choco{"\n"}Multigrain Cookies
          </Text>
          <View style={styles.productContent}>
            <View style={styles.productImage} />
            <View style={styles.productInfo}>
              <View style={styles.ratingContainer}>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingNumber}>3.5</Text>
                  <Text style={styles.ratingSubtext}>Out of 5</Text>
                </View>
                <Text style={styles.ratingLabel}>Good</Text>
              </View>
              <View style={styles.productActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="heart-outline" size={20} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="add-circle-outline" size={20} color="#333" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Upgrade Banner */}
        <View style={styles.upgradeCard}>
          <Text style={styles.upgradeTitle}>If you are free , pls make an effort for customers to find this product</Text>
          <TouchableOpacity style={styles.upgradeButton} onPress={() => Linking.openURL("https://www.amazon.in/Parle-Platina-Chocolate-Cookies-412-5g/dp/B07QN74QDJ?mcid=fc3099ec51aa3141925ed55f18308b16&tag=googleshopdes-21&linkCode=df0&hvadid=709962097337&hvpos=&hvnetw=g&hvrand=11419406442433953635&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9062011&hvtargid=pla-1278247482672&psc=1&gad_source=1")}>
            <Text style={styles.upgradeButtonText}>Report the Product's Location</Text>
          </TouchableOpacity>
        </View>

        {/* Nutrition Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>Per 100 g</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Per 30 g</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="information-circle-outline" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        {/* What Concerns Us */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What Concerns Us 😟</Text>
          {concernsData.map((item, index) => (
            <View key={index} style={styles.nutritionItem}>
              <View style={styles.nutritionLeft}>
                <Text style={styles.nutritionIcon}>{item.icon}</Text>
                <Text style={styles.nutritionName}>{item.name}</Text>
              </View>
              <View style={styles.nutritionRight}>
                <Text style={[styles.nutritionValue, { color: item.color }]}>{item.value}</Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            </View>
          ))}
        </View>

        {/* What We Like */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What We Like 😊</Text>
          {likesData.map((item, index) => (
            <View key={index} style={styles.nutritionItem}>
              <View style={styles.nutritionLeft}>
                <Text style={styles.nutritionIcon}>{item.icon}</Text>
                <Text style={styles.nutritionName}>{item.name}</Text>
              </View>
              <View style={styles.nutritionRight}>
                <Text style={[styles.nutritionValue, { color: item.color }]}>{item.value}</Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            </View>
          ))}
        </View>

        {/* All Nutrients & Ingredients */}
        <TouchableOpacity style={styles.expandableItem}>
          <Text style={styles.expandableText}>All Nutrients</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.expandableItem}>
          <Text style={styles.expandableText}>All Ingredients</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        {/* Highest Rated Banner */}
        <View style={styles.highestRatedBanner}>
          <Text style={styles.bannerTitle}>Highest Rated Product</Text>
          <Text style={styles.bannerSubtitle}>
            This is already the best-rated product in it's{"\n"}category within our database.
          </Text>
        </View>

        {/* Feedback */}
        <View style={styles.feedbackSection}>
          <Text style={styles.feedbackTitle}>
            Did you find this{"\n"}information helpful?
          </Text>
          <View style={styles.feedbackButtons}>
            <TouchableOpacity style={styles.feedbackButton}>
              <Text style={styles.thumbsUp}>👍</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.feedbackButton}>
              <Text style={styles.thumbsDown}>👎</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  },
  backButton: {
    padding: 5,
  },
  headerActions: {
    flexDirection: "row",
  },
  headerButton: {
    padding: 5,
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
  },
  productCard: {
    backgroundColor: "#f8f9fa",
    margin: 20,
    borderRadius: 15,
    padding: 20,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 26,
  },
  productContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 80,
    height: 60,
    backgroundColor: "#8b5cf6",
    borderRadius: 8,
    marginRight: 20,
  },
  productInfo: {
    flex: 1,
    alignItems: "center",
  },
  ratingContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  ratingBadge: {
    backgroundColor: "#22c55e",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  ratingNumber: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  ratingSubtext: {
    color: "#fff",
    fontSize: 12,
  },
  ratingLabel: {
    color: "#22c55e",
    fontSize: 14,
    fontWeight: "600",
  },
  productActions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
    marginHorizontal: 5,
  },
  upgradeCard: {
    backgroundColor: "#8b5cf6",
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
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
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: "#8b5cf6",
  },
  tabText: {
    color: "#666",
    fontSize: 14,
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },
  infoButton: {
    padding: 5,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  nutritionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  nutritionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  nutritionIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  nutritionName: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  nutritionRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 10,
  },
  chevron: {
    fontSize: 16,
    color: "#999",
  },
  expandableItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    marginHorizontal: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
  },
  expandableText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  highestRatedBanner: {
    backgroundColor: "#f8f9fa",
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  feedbackSection: {
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  feedbackTitle: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  feedbackButtons: {
    flexDirection: "row",
  },
  feedbackButton: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 50,
    marginHorizontal: 10,
  },
  thumbsUp: {
    fontSize: 24,
  },
  thumbsDown: {
    fontSize: 24,
  },
  bottomSpacing: {
    height: 50,
  },
}); 