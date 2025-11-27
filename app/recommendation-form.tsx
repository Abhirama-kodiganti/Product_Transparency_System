import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BACKEND_URL } from "@/constants/Api";

export default function RecommendationFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ userId?: string }>();
  const userId = (params.userId as string) || "default-user";

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [skinType, setSkinType] = useState("");
  const [skinConcern, setSkinConcern] = useState("");
  const [hairType, setHairType] = useState("");
  const [hairConcern, setHairConcern] = useState("");
  const [allergens, setAllergens] = useState("");
  const [preferredIngredients, setPreferredIngredients] = useState("");
  const [vegan, setVegan] = useState<"yes" | "no" | "">("");
  const [fragranceFree, setFragranceFree] = useState<"yes" | "no" | "">("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const hydrateForm = (preference?: any) => {
    setName(preference?.name ?? "");
    setAge(preference?.age ? String(preference.age) : "");
    setSkinType(preference?.skin_type ?? "");
    setSkinConcern(preference?.skin_concern ?? "");
    setHairType(preference?.hair_type ?? "");
    setHairConcern(preference?.hair_concern ?? "");
    setAllergens(preference?.allergens ?? "");
    setPreferredIngredients(preference?.ingredients ?? "");
    setVegan((preference?.vegan as "yes" | "no" | "") ?? "");
    setFragranceFree((preference?.fragrance_free as "yes" | "no" | "") ?? "");
    setBudget(preference?.budget ?? "");
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${BACKEND_URL}/user-preferences/${userId}`)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          hydrateForm(data.preference);
        } else if (res.status === 404) {
          hydrateForm();
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Name required", "Please add your name so we can personalize things for you.");
      return;
    }

    const parsedAge = age ? Number(age) : null;
    const safeAge = parsedAge !== null && !Number.isNaN(parsedAge) ? parsedAge : null;

    const payload = {
      userId,
      name: name.trim(),
      age: safeAge,
      skin_type: skinType.trim(),
      skin_concern: skinConcern.trim(),
      hair_type: hairType.trim(),
      hair_concern: hairConcern.trim(),
      allergens: allergens.trim(),
      ingredients: preferredIngredients.trim(),
      vegan,
      fragrance_free: fragranceFree,
      budget: budget.trim(),
    };

    setSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/user-preferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save preferences");
      }

      Alert.alert("Preferences saved", "Your personalization profile has been stored successfully.");
      router.back();
    } catch (error) {
      Alert.alert("Error", "We couldn't save your preferences. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete personalization?",
      "This will remove all saved preferences and return the experience to Basic mode.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              const response = await fetch(`${BACKEND_URL}/user-preferences/${userId}`, {
                method: "DELETE",
              });
              if (!response.ok) {
                throw new Error("Failed to delete preferences");
              }
              Alert.alert("Removed", "Your profile has been deleted.");
              router.back();
            } catch (error) {
              Alert.alert("Error", "Unable to delete your profile. Please try again.");
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const toggleChoice = (
    current: "yes" | "no" | "",
    setter: (v: "yes" | "no" | "") => void,
    value: "yes" | "no"
  ) => {
    setter(current === value ? "" : value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={22} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Preferences</Text>
          <View style={{ width: 32 }} />
        </View>

        <Text style={styles.headerSubtitle}>
          Tell us a bit about yourself so we can match food and cosmetics that truly fit your lifestyle.
        </Text>

        {loading && (
          <View style={styles.loadingCard}>
            <ActivityIndicator color="#6366F1" />
            <Text style={styles.loadingText}>Loading your preferences...</Text>
          </View>
        )}

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic details</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#9CA3AF"
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Skin Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skin preferences</Text>
          <Text style={styles.label}>Skin type</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Oily, Dry, Combination, Sensitive"
            value={skinType}
            onChangeText={setSkinType}
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>Main skin concern</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Acne, Pigmentation, Dullness, Aging"
            value={skinConcern}
            onChangeText={setSkinConcern}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Hair Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hair preferences</Text>
          <Text style={styles.label}>Hair type</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Curly, Straight, Wavy, Coily"
            value={hairType}
            onChangeText={setHairType}
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>Main hair concern</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Hair fall, Dandruff, Frizz, Dryness"
            value={hairConcern}
            onChangeText={setHairConcern}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Allergens & Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients & allergens</Text>
          <Text style={styles.label}>Allergens to avoid</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Nuts, Dairy, Gluten (comma separated)"
            value={allergens}
            onChangeText={setAllergens}
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>Preferred star ingredients</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Niacinamide, Hyaluronic acid, Vitamin C"
            value={preferredIngredients}
            onChangeText={setPreferredIngredients}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Lifestyle Toggles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lifestyle</Text>

          <Text style={styles.label}>Vegan only?</Text>
          <View style={styles.choiceRow}>
            <TouchableOpacity
              style={[
                styles.choiceChip,
                vegan === "yes" && styles.choiceChipActive,
              ]}
              onPress={() => toggleChoice(vegan, setVegan, "yes")}
            >
              <Text
                style={[
                  styles.choiceChipText,
                  vegan === "yes" && styles.choiceChipTextActive,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.choiceChip,
                vegan === "no" && styles.choiceChipActive,
              ]}
              onPress={() => toggleChoice(vegan, setVegan, "no")}
            >
              <Text
                style={[
                  styles.choiceChipText,
                  vegan === "no" && styles.choiceChipTextActive,
                ]}
              >
                No preference
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Fragrance free only?</Text>
          <View style={styles.choiceRow}>
            <TouchableOpacity
              style={[
                styles.choiceChip,
                fragranceFree === "yes" && styles.choiceChipActive,
              ]}
              onPress={() => toggleChoice(fragranceFree, setFragranceFree, "yes")}
            >
              <Text
                style={[
                  styles.choiceChipText,
                  fragranceFree === "yes" && styles.choiceChipTextActive,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.choiceChip,
                fragranceFree === "no" && styles.choiceChipActive,
              ]}
              onPress={() => toggleChoice(fragranceFree, setFragranceFree, "no")}
            >
              <Text
                style={[
                  styles.choiceChipText,
                  fragranceFree === "no" && styles.choiceChipTextActive,
                ]}
              >
                No preference
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Budget */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Budget-friendly, Mid-range, Premium"
            value={budget}
            onChangeText={setBudget}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.deleteButton, deleting && styles.deleteButtonDisabled]}
          onPress={handleDelete}
          disabled={deleting || submitting}
        >
          <Text style={styles.deleteButtonText}>{deleting ? "Deleting..." : "Delete profile"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>{submitting ? "Saving..." : "Save & continue"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  loadingCard: {
    backgroundColor: "#EEF2FF",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginHorizontal: 20,
  },
  loadingText: {
    marginLeft: 10,
    color: "#4C1D95",
    fontWeight: "600",
  },
  section: {
    marginTop: 16,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#F9FAFB",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },
  choiceRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  choiceChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 8,
    backgroundColor: "#FFFFFF",
  },
  choiceChipActive: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
  choiceChipText: {
    fontSize: 13,
    color: "#374151",
  },
  choiceChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  bottomSpacing: {
    height: 80,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  deleteButton: {
    backgroundColor: "#fee2e2",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#fca5a5",
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  deleteButtonText: {
    color: "#b91c1c",
    fontWeight: "700",
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: "#6366F1",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});


