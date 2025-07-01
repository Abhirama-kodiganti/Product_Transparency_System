import { Feather, Ionicons } from "@expo/vector-icons"
import { Link } from "expo-router"
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native"
import React, { useState } from "react"
import { MEDICINE_DB , Medicine } from './Medical_DB';



type MedicineKey = keyof typeof MEDICINE_DB

const SYMPTOMS = [
  { key: 'headache', label: 'Headache', icon: 'target' },
  { key: 'fever', label: 'Fever', icon: 'thermometer' },
  { key: 'cold', label: 'Cold', icon: 'cloud-drizzle' },
  { key: 'bodypain', label: 'Body Pain', icon: 'activity' },
  { key: 'allergy', label: 'Allergy', icon: 'wind' },
  { key: 'nausea', label: 'Nausea', icon: 'meh' },
]




type InteractionKey =
  | 'paracetamol+ibuprofen'
  | 'paracetamol+alcohol'
  | 'cetirizine+alcohol';

const INTERACTIONS: Record<InteractionKey, string> = {
  'paracetamol+ibuprofen': '✅ Safe combination',
  'paracetamol+alcohol': '❌ Not recommended together',
  'cetirizine+alcohol': '⚠️ Use with caution',
}

export default function MedicineScreen() {
  // State for symptom finder
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [suggestedMeds, setSuggestedMeds] = useState<Medicine[]>([])

  // State for medicine info search
  const [medicineQuery, setMedicineQuery] = useState("")
  const [medicineInfo, setMedicineInfo] = useState<Medicine | null>(null)

  // State for safety checker
  const [med1, setMed1] = useState("")
  const [med2, setMed2] = useState("")
  const [safetyResult, setSafetyResult] = useState("")

  // Symptom-to-Medicine Finder logic
  const handleSymptomPress = (key: string) => {
    const newSelected = selectedSymptoms.includes(key)
      ? selectedSymptoms.filter(s => s !== key)
      : [...selectedSymptoms, key]
    setSelectedSymptoms(newSelected)

    if (newSelected.length === 0) {
      setSuggestedMeds([])
      return
    }

    const symptomKeywords: Record<string, string[]> = {
      headache: ["headache", "pain"],
      fever: ["fever"],
      cold: ["cold", "runny nose", "sneezing", "congestion", "flu"],
      bodypain: ["body pain", "pain", "muscle pain", "swelling", "ache"],
      allergy: ["allergy", "hives", "sneezing"],
      nausea: ["nausea", "vomiting", "bloating", "indigestion", "sickness"],
    }

    const suggested: Medicine[] = []
    const suggestedKeys = new Set<string>()

    newSelected.forEach(symptom => {
      const keywords = symptomKeywords[symptom] || []
      Object.entries(MEDICINE_DB).forEach(([medKey, med]) => {
        if (suggestedKeys.has(medKey)) return

        const purposeText = med.purpose.toLowerCase()
        const nameText = med.name.toLowerCase()

        for (const keyword of keywords) {
          if (purposeText.includes(keyword) || nameText.includes(keyword)) {
            suggested.push(med)
            suggestedKeys.add(medKey)
            break
          }
        }
      })
    })

    // Limit to a reasonable number of suggestions
    setSuggestedMeds(suggested.slice(0, 5))
  }

  // Medicine Info Search logic
  const handleMedicineSearch = () => {
    const key = medicineQuery.trim().toLowerCase()
    if (key in MEDICINE_DB) {
      setMedicineInfo(MEDICINE_DB[key as MedicineKey])
    } else {
      setMedicineInfo(null)
      Alert.alert("Not found", "Medicine not found in demo database.")
    }
  }

  // Safety Checker logic
  const handleSafetyCheck = () => {
    const key = `${med1.trim().toLowerCase()}+${med2.trim().toLowerCase()}` as keyof typeof INTERACTIONS;

    const result = key in INTERACTIONS
      ? INTERACTIONS[key]
      : 'No known interaction in demo database.';

    setSafetyResult(result);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.userName}>Abhiram</Text>
            <Text style={styles.welcomeText}>Welcome to TruthIn</Text>
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
          <TextInput style={styles.searchInput} placeholder="Search for Medicines" placeholderTextColor="#999" />
        </View>

        {/* Category Tabs */}
        <View style={styles.categoryTabsContainer}>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.categoryTab}>
              <Text style={styles.categoryTabText}>Food</Text>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity style={[styles.categoryTab, styles.activeCategoryTab]}>
            <Text style={[styles.categoryTabText, styles.activeCategoryTabText]}>Medicine</Text>
          </TouchableOpacity>
          <Link href="/cosmetics" asChild>
            <TouchableOpacity style={styles.categoryTab}>
              <Text style={styles.categoryTabText}>Cosmetics</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Green Banner (keep as is) */}
        <View style={[styles.featuredCard]}>
          <View style={styles.featuredContent}>
            <View style={styles.featuredText}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                <Text style={styles.featuredTitle}>Medicine</Text>
              </View>
              <Text style={styles.featuredDescription}>Tap to explore medicines.</Text>
              <TouchableOpacity style={styles.knowMoreButton}>
                <Text style={styles.knowMoreText}>Know More</Text>
                <Ionicons name="chevron-forward" size={16} color="#6366f1" />
              </TouchableOpacity>
            </View>
            <View style={styles.featuredImageContainer}>
              <Image source={{ uri: "https://i.pinimg.com/736x/f4/88/12/f488128e699e322ade045e72618cc829.jpg" }} style={styles.productImage} />
            </View>
          </View>
        </View>

        {/* Symptom-to-Medicine Finder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Find Medicine by Symptom</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
            {SYMPTOMS.map(sym => (
              <TouchableOpacity
                key={sym.key}
                style={{
                  backgroundColor: selectedSymptoms.includes(sym.key) ? '#90EE90' : '#f0f0f0',
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  margin: 4,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: selectedSymptoms.includes(sym.key) ? 2 : 1,
                  borderColor: selectedSymptoms.includes(sym.key) ? '#10d9c4' : '#e0e0e0',
                }}
                onPress={() => handleSymptomPress(sym.key)}
              >
                <Feather name={sym.icon as any} size={18} color={selectedSymptoms.includes(sym.key) ? '#0a7d4f' : '#666'} style={{ marginRight: 6 }} />
                <Text style={{ color: selectedSymptoms.includes(sym.key) ? '#0a7d4f' : '#333', fontWeight: '600' }}>{sym.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {suggestedMeds.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: 'bold', color: '#0a7d4f', marginBottom: 6 }}>Suggested Medicines:</Text>
              {suggestedMeds.map(med => (
                <View key={med.name} style={{ backgroundColor: '#e6fff2', borderRadius: 12, padding: 10, marginBottom: 8 }}>
                  <Text style={{ fontWeight: 'bold', color: '#0a7d4f' }}>{med.name}</Text>
                  <Text style={{ color: '#333' }}>{med.purpose}</Text>
                  <Text style={{ color: '#666', fontSize: 12 }}>Brands: {med.brands.join(', ')}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Medicine Info Search */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medicine Info</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <TextInput
              style={{ flex: 1, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, padding: 10, marginRight: 10, backgroundColor: '#f8f9fa' }}
              placeholder="Type medicine name (e.g. Paracetamol)"
              value={medicineQuery}
              onChangeText={setMedicineQuery}
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={handleMedicineSearch} style={{ backgroundColor: '#10d9c4', borderRadius: 10, padding: 10 }}>
              <Feather name="search" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          {medicineInfo && (
            <View style={{ backgroundColor: '#e6fff2', borderRadius: 12, padding: 14, marginTop: 8 }}>
              <Text style={{ fontWeight: 'bold', color: '#0a7d4f', fontSize: 16 }}>{medicineInfo.name}</Text>
              <Text style={{ color: '#333', marginBottom: 2 }}>{medicineInfo.purpose}</Text>
              <Text style={{ color: '#666', fontSize: 13 }}>Ingredients: {medicineInfo.ingredients}</Text>
              <Text style={{ color: '#666', fontSize: 13 }}>Side Effects: {medicineInfo.sideEffects}</Text>
              <Text style={{ color: '#666', fontSize: 13 }}>Warnings: {medicineInfo.warnings}</Text>
              <Text style={{ color: '#666', fontSize: 13 }}>Interactions: {medicineInfo.interactions}</Text>
              <Text style={{ color: '#666', fontSize: 13 }}>Safe for Children: {medicineInfo.age}</Text>
              <Text style={{ color: '#666', fontSize: 13 }}>Pregnancy: {medicineInfo.pregnancy}</Text>
              <Text style={{ color: '#666', fontSize: 13 }}>Diabetes: {medicineInfo.diabetes}</Text>
              <Text style={{ color: '#0a7d4f', fontWeight: 'bold', marginTop: 6 }}>Trust/Transparency:</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 }}>
                {medicineInfo.trust.map((t: string) => (
                  <View key={t} style={{ backgroundColor: '#b2f7e2', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, margin: 2 }}>
                    <Text style={{ color: '#0a7d4f', fontSize: 12 }}>{t}</Text>
                  </View>
                ))}
              </View>
              <Text style={{ color: '#0a7d4f', fontWeight: 'bold', marginTop: 6 }}>Alternatives:</Text>
              <Text style={{ color: '#333', fontSize: 13 }}>{medicineInfo.alternatives.join(', ')}</Text>
            </View>
          )}
        </View>

        {/* Safety Checker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medicine Safety Checker</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <TextInput
              style={{ flex: 1, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, padding: 10, marginRight: 10, backgroundColor: '#f8f9fa' }}
              placeholder="Medicine 1"
              value={med1}
              onChangeText={setMed1}
              placeholderTextColor="#999"
            />
            <Text style={{ fontWeight: 'bold', color: '#666', marginHorizontal: 4 }}>+</Text>
            <TextInput
              style={{ flex: 1, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, padding: 10, marginLeft: 10, backgroundColor: '#f8f9fa' }}
              placeholder="Medicine 2"
              value={med2}
              onChangeText={setMed2}
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={handleSafetyCheck} style={{ backgroundColor: '#10d9c4', borderRadius: 10, padding: 10, marginLeft: 10 }}>
              <Feather name="shield" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          {safetyResult !== '' && (
            <View style={{ backgroundColor: '#e6fff2', borderRadius: 12, padding: 12, marginTop: 8 }}>
              <Text style={{ color: safetyResult.includes('Safe') ? '#0a7d4f' : safetyResult.includes('caution') ? '#e6b800' : '#d90429', fontWeight: 'bold' }}>{safetyResult}</Text>
            </View>
          )}
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

        <TouchableOpacity style={styles.scanButton}>
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
    backgroundColor: "#90EE90",
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
    height: 92,
    borderRadius: 15,
    position: "absolute",
    right: 0,
    left: 69.9,
    bottom: 38,
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