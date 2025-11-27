import { Feather, Ionicons } from "@expo/vector-icons"
import { Link, router } from "expo-router"
import { useCallback, useState } from "react"
import { Alert, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { BACKEND_URL } from "@/constants/Api"

const DEFAULT_USER_ID = "default-user"

export default function CosmeticsScreen() {
  const [userPreferences, setUserPreferences] = useState<any | null>(null)
  const [showPreferencePrompt, setShowPreferencePrompt] = useState(false)
  const [isPreferenceLoading, setIsPreferenceLoading] = useState(false)
  const [promptDismissed, setPromptDismissed] = useState(false)

  const fetchUserPreferences = useCallback(() => {
    setIsPreferenceLoading(true)
    fetch(`${BACKEND_URL}/user-preferences/${DEFAULT_USER_ID}`)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json()
          setUserPreferences(data.preference)
          setShowPreferencePrompt(false)
          setPromptDismissed(true)
        } else if (res.status === 404) {
          setUserPreferences(null)
          setShowPreferencePrompt(!promptDismissed)
        } else {
          setUserPreferences(null)
        }
      })
      .catch(() => {
        setUserPreferences(null)
      })
      .finally(() => setIsPreferenceLoading(false))
  }, [promptDismissed])

  useFocusEffect(
    useCallback(() => {
      fetchUserPreferences()
    }, [fetchUserPreferences])
  )

  const handlePreferenceChoice = (choice: 'yes' | 'no') => {
    setShowPreferencePrompt(false)
    if (choice === 'yes') {
      setPromptDismissed(true)
      router.push({ pathname: '/recommendation-form', params: { userId: DEFAULT_USER_ID } } as any)
    } else {
      setPromptDismissed(true)
    }
  }

  const handleProfilePress = () => {
    if (userPreferences) {
      router.push({ pathname: '/recommendation-form', params: { userId: DEFAULT_USER_ID } } as any)
    } else {
      setPromptDismissed(false)
      setShowPreferencePrompt(true)
    }
  }

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
            <TouchableOpacity style={styles.profileContainer} onPress={handleProfilePress} activeOpacity={0.75}>
              <View style={styles.avatar}>
                <Feather name="user" size={24} color="#6366f1" />
              </View>
              <View style={[styles.planBadge, userPreferences && styles.planBadgeActive]}>
                <Text style={[styles.planText, userPreferences && styles.planTextActive]}>
                  {userPreferences ? 'Personalized' : 'Basic'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="Search for Cosmetics" placeholderTextColor="#999" />
        </View>

        {/* Category Tabs */}
        <View style={styles.categoryTabsContainer}>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.categoryTab}>
              <Text style={styles.categoryTabText}>Food</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/medicine" asChild>
            <TouchableOpacity style={styles.categoryTab}>
              <Text style={styles.categoryTabText}>Medicine</Text>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity style={[styles.categoryTab, styles.activeCategoryTab]}>
            <Text style={[styles.categoryTabText, styles.activeCategoryTabText]}>Cosmetics</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Card */}
        <View style={[styles.featuredCard]}>
          <View style={styles.featuredContent}>
            <View style={styles.featuredText}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                <Text style={styles.featuredTitle}>Cosmetics</Text>
              </View>
              <Text style={styles.featuredDescription}>Tap to explore cosmetics.</Text>
              <TouchableOpacity style={styles.knowMoreButton}>
                <Text style={styles.knowMoreText}>Know More</Text>
                <Ionicons name="chevron-forward" size={16} color="#6366f1" />
              </TouchableOpacity>
            </View>
            <View style={styles.featuredImageContainer}>
              <Image source={{ uri: "https://i.pinimg.com/736x/19/28/b0/1928b04dd0ba3c39ea10deddbf95653b.jpg" }} style={styles.productImage} />
            </View>
          </View>
        </View>

        {/* Top-rated Healthy Picks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top-rated Healthy Picks</Text>
          <View style={styles.picksContainer}>
            <View style={styles.pickCard}>
              <View>
                <Text style={styles.pickTitle}>Glow{"\n"}Essentials</Text>
              </View>
              <Image source={{ uri: "https://i.pinimg.com/1200x/a4/b3/2c/a4b32cd37fe589a897ba528a976eca63.jpg" }} style={styles.pickImage} />
            </View>
            <View style={styles.pickCard}>
              <View>
                <Text style={styles.pickTitle}>Radiant{"\n"}Touch</Text>
              </View>
              <Image source={{ uri: "https://i.pinimg.com/736x/eb/f8/ec/ebf8ec7338db116f526425b2cfe0a1a8.jpg" }} style={styles.pickImage} />
            </View>
          </View>
        </View>

        {/* All Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoriesGrid}>
              <TouchableOpacity 
                style={styles.categoryItem}
                onPress={() => router.push({ pathname: "/cosmetic-category" as any, params: { category: "hair-care" } })}
              >
                <Image source={{ uri: "https://i.pinimg.com/1200x/02/a6/77/02a6779cff12128afa021121bf6b38b3.jpg" }} style={styles.categoryImage} />
                <Text style={styles.categoryLabel}>Hair care</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.categoryItem}
                onPress={() => router.push({ pathname: "/cosmetic-category" as any, params: { category: "skin-care" } })}
              >
                <Image source={{ uri: "https://i.pinimg.com/1200x/a4/3b/0c/a43b0c98595522304b7bd5bf5162e53c.jpg" }} style={styles.categoryImage} />
                <Text style={styles.categoryLabel}>Skin care</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.categoryItem}
                onPress={() => router.push({ pathname: "/cosmetic-category" as any, params: { category: "body-care" } })}
              >
                <Image source={{ uri: "https://i.pinimg.com/1200x/17/aa/49/17aa4993f9bc8bba0c2719bef7d57785.jpg" }} style={styles.categoryImage} />
                <Text style={styles.categoryLabel}>Body care</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.categoryItem}
                onPress={() => router.push({ pathname: "/cosmetic-category" as any, params: { category: "all-up-glam" } })}
              >
                <Image source={{ uri: "https://i.pinimg.com/1200x/6e/8b/51/6e8b515c8ac6f6a4851aacff57e4e8cf.jpg" }} style={styles.categoryImage} />
                <Text style={styles.categoryLabel}>All up glam</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Preference prompt */}
      {showPreferencePrompt && !isPreferenceLoading && (
        <View style={styles.preferenceOverlay}>
          <View style={styles.preferenceCard}>
            <Text style={styles.preferenceTitle}>Modify according to your needs?</Text>
            <Text style={styles.preferenceSubtitle}>
              Share your routine so we can tailor cosmetic picks.
            </Text>
            <View style={styles.preferenceButtonsRow}>
              <TouchableOpacity
                style={[styles.preferenceButton, styles.preferenceNoButton]}
                onPress={() => handlePreferenceChoice('no')}
              >
                <Text style={[styles.preferenceButtonText, styles.preferenceNoButtonText]}>No, continue</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.preferenceButton, styles.preferenceYesButton]}
                onPress={() => handlePreferenceChoice('yes')}
              >
                <Text style={styles.preferenceButtonText}>Yes, customize</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

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
  planBadgeActive: {
    backgroundColor: "#6366f1",
  },
  planText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  planTextActive: {
    color: "#fff",
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
    backgroundColor: "#fc8eac",
    borderRadius: 20,
    padding: 10,
    marginBottom: 30,
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
    width: 91,
    height: 90,
    borderRadius: 15,
    position: "absolute",
    right: 0,
    left: 69.9,
    bottom: 40,
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
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 15,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
  },
  categoryLabel: {
    marginTop: 8,
    fontSize: 12,
    color: "#333",
  },
  bottomSpacing: {
    height: 100,
  },
  preferenceOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  preferenceCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  preferenceTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 6,
  },
  preferenceSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 18,
  },
  preferenceButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  preferenceButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  preferenceNoButton: {
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    marginRight: 8,
  },
  preferenceYesButton: {
    borderColor: "#6366F1",
    backgroundColor: "#6366F1",
  },
  preferenceButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  preferenceNoButtonText: {
    color: "#374151",
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