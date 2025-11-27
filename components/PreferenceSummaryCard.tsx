import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface PreferenceSummaryCardProps {
  preference: any;
  onEdit: () => void;
}

export default function PreferenceSummaryCard({ preference, onEdit }: PreferenceSummaryCardProps) {
  if (!preference) return null;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Personalized for {preference.name || "you"}</Text>
          <Text style={styles.subtitle}>These preferences power food, medicine & cosmetics picks</Text>
        </View>
        <TouchableOpacity onPress={onEdit}>
          <Text style={styles.editLink}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skin</Text>
        <View style={styles.chipRow}>
          {preference.skin_type ? <Text style={styles.chip}>{preference.skin_type}</Text> : null}
          {preference.skin_concern ? <Text style={styles.chip}>{preference.skin_concern}</Text> : null}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hair</Text>
        <View style={styles.chipRow}>
          {preference.hair_type ? <Text style={styles.chip}>{preference.hair_type}</Text> : null}
          {preference.hair_concern ? <Text style={styles.chip}>{preference.hair_concern}</Text> : null}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lifestyle</Text>
        <View style={styles.chipRow}>
          {preference.vegan ? <Text style={styles.chip}>{preference.vegan === "yes" ? "Vegan only" : "Not vegan specific"}</Text> : null}
          {preference.fragrance_free ? (
            <Text style={styles.chip}>{preference.fragrance_free === "yes" ? "Fragrance free" : "Fragrance ok"}</Text>
          ) : null}
          {preference.budget ? <Text style={styles.chip}>{preference.budget}</Text> : null}
        </View>
      </View>

      {(preference.allergens || preference.ingredients) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {preference.allergens ? <Text style={styles.bodyText}>Avoid: {preference.allergens}</Text> : null}
          {preference.ingredients ? <Text style={styles.bodyText}>Love: {preference.ingredients}</Text> : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f5f3ff",
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#312e81",
  },
  subtitle: {
    fontSize: 12,
    color: "#4c1d95",
    marginTop: 4,
  },
  editLink: {
    color: "#7c3aed",
    fontWeight: "600",
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4c1d95",
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 2,
  },
  chip: {
    backgroundColor: "#ede9fe",
    color: "#4c1d95",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "600",
    marginRight: 8,
    marginBottom: 6,
  },
  bodyText: {
    fontSize: 12,
    color: "#4338ca",
  },
});

