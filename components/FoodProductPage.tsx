import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FoodProductPageProps {
  product: any;
  onBack: () => void;
}

// Icons for each nutrient (can be replaced with SVGs or other icon sets)
const NUTRIENT_ICONS: Record<string, string> = {
  'Additives': '🧪',
  'Energy': '⚡',
  'Total Sugars': '🍬',
  'Added Sugars': '🥄',
  'Total Fat': '🥓',
  'Saturated Fat': '🧈',
  'Dietary Fiber': '🌱',
  'Trans Fat': '🚫',
  'Cholesterol': '💊',
  'Sodium': '🧂',
};

const getProductImage = (product: any) => {
  if (product?.image_front_url) return { uri: product.image_front_url };
  return { uri: 'https://i.pinimg.com/564x/2e/2d/2e/2e2d2e2d2e2d2e2d2e2d2e2d2e2d2e2d.jpg' };
};

const getHealthRating = (product: any) => {
  const grade = product?.nutrition_grade_fr || product?.nutriscore_grade || null;
  if (!grade) return { label: 'Unknown', color: '#a3a3a3', value: '?' };
  const map: any = {
    a: { label: 'Excellent', color: '#22c55e', value: 'A' },
    b: { label: 'Good', color: '#84cc16', value: 'B' },
    c: { label: 'Average', color: '#f59e0b', value: 'C' },
    d: { label: 'Poor', color: '#ef4444', value: 'D' },
    e: { label: 'Bad', color: '#dc2626', value: 'E' },
  };
  return map[grade] || { label: 'Unknown', color: '#a3a3a3', value: grade.toUpperCase() };
};

const getBrand = (product: any) => product?.brands?.split(',')[0] || 'Unknown Brand';
const getQuantity = (product: any) => product?.quantity || 'Unknown Quantity';
const getIngredients = (product: any) => product?.ingredients_text || 'No ingredient info available.';

// Split nutrients into concerns and likes
const getNutrientSections = (product: any) => {
  const n = product?.nutriments || {};
  // What Concerns Us
  const concerns = [
    { label: 'Additives', value: product.additives_n || '—', color: '#f59e0b', icon: NUTRIENT_ICONS['Additives'] },
    { label: 'Energy', value: n['energy-kcal_100g'] ? `${n['energy-kcal_100g']} kcal` : '—', color: '#f59e0b', icon: NUTRIENT_ICONS['Energy'] },
    { label: 'Total Sugars', value: n['sugars_100g'] ? `${n['sugars_100g']} g` : '—', color: '#f59e0b', icon: NUTRIENT_ICONS['Total Sugars'] },
    { label: 'Added Sugars', value: n['added-sugars_100g'] ? `${n['added-sugars_100g']} g` : '—', color: '#f59e0b', icon: NUTRIENT_ICONS['Added Sugars'] },
    { label: 'Total Fat', value: n['fat_100g'] ? `${n['fat_100g']} g` : '—', color: '#f59e0b', icon: NUTRIENT_ICONS['Total Fat'] },
    { label: 'Saturated Fat', value: n['saturated-fat_100g'] ? `${n['saturated-fat_100g']} g` : '—', color: '#ef4444', icon: NUTRIENT_ICONS['Saturated Fat'] },
  ];
  // What We Like
  const likes = [
    { label: 'Dietary Fiber', value: n['fiber_100g'] ? `${n['fiber_100g']} g` : '—', color: '#22c55e', icon: NUTRIENT_ICONS['Dietary Fiber'] },
    { label: 'Trans Fat', value: n['trans-fat_100g'] ? `${n['trans-fat_100g']} g` : '—', color: '#22c55e', icon: NUTRIENT_ICONS['Trans Fat'] },
    { label: 'Cholesterol', value: n['cholesterol_100g'] ? `${n['cholesterol_100g']} mg` : '—', color: '#22c55e', icon: NUTRIENT_ICONS['Cholesterol'] },
    { label: 'Sodium', value: n['sodium_100g'] ? `${n['sodium_100g']} mg` : '—', color: '#22c55e', icon: NUTRIENT_ICONS['Sodium'] },
  ];
  return { concerns, likes };
};

const FoodProductPage: React.FC<FoodProductPageProps> = ({ product, onBack }) => {
  const health = getHealthRating(product);
  const brand = getBrand(product);
  const quantity = getQuantity(product);
  const ingredients = getIngredients(product);
  const imageSource = getProductImage(product);
  const { concerns, likes } = getNutrientSections(product);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Product Card */}
        <View style={styles.productCard}>
          <Image source={imageSource} style={styles.productImage} resizeMode="contain" />
          <Text style={styles.productTitle}>{product.product_name || product.product_name_en || 'Unknown Product'}</Text>
          <Text style={styles.productBrand}>{brand}</Text>
          <Text style={styles.productQuantity}>{quantity}</Text>
          <View style={[styles.healthBadge, { backgroundColor: health.color }]}> 
            <Text style={styles.healthBadgeText}>{health.value}</Text>
            <Text style={styles.healthBadgeLabel}>{health.label}</Text>
          </View>
        </View>
        {/* What Concerns Us */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What Concerns Us 😯</Text>
          {concerns.map((item, idx) => (
            <View key={idx} style={styles.nutrientRow}>
              <Text style={[styles.nutrientIcon, { color: item.color }]}>{item.icon}</Text>
              <Text style={[styles.nutrientLabel, { color: '#111', fontWeight: 'bold' }]}>{item.label}</Text>
              <Text style={[styles.nutrientValue, { color: item.color }]}>{item.value}</Text>
            </View>
          ))}
        </View>
        {/* What We Like */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What We Like 🙂</Text>
          {likes.map((item, idx) => (
            <View key={idx} style={styles.nutrientRow}>
              <Text style={[styles.nutrientIcon, { color: item.color }]}>{item.icon}</Text>
              <Text style={[styles.nutrientLabel, { color: '#111', fontWeight: 'bold' }]}>{item.label}</Text>
              <Text style={[styles.nutrientValue, { color: item.color }]}>{item.value}</Text>
            </View>
          ))}
        </View>
        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <Text style={styles.ingredientsText}>{ingredients}</Text>
        </View>
        {/* Badges (example: allergens, vegan, etc.) */}
        <View style={styles.badgesRow}>
          {product.allergens && product.allergens.length > 0 && (
            <View style={[styles.badge, { backgroundColor: '#f59e0b' }]}> 
              <Text style={styles.badgeText}>Contains Allergens</Text>
            </View>
          )}
          {product.vegan && (
            <View style={[styles.badge, { backgroundColor: '#22c55e' }]}> 
              <Text style={styles.badgeText}>Vegan</Text>
            </View>
          )}
          {product.vegetarian && (
            <View style={[styles.badge, { backgroundColor: '#84cc16' }]}> 
              <Text style={styles.badgeText}>Vegetarian</Text>
            </View>
          )}
        </View>
        {/* Feedback */}
        <View style={styles.feedbackSection}>
          <Text style={styles.feedbackTitle}>Did you find this information helpful?</Text>
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
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  scrollView: { flex: 1 },
  productCard: { backgroundColor: '#f8f9fa', margin: 20, borderRadius: 15, padding: 20, alignItems: 'center' },
  productImage: { width: 120, height: 120, borderRadius: 12, backgroundColor: '#e5e7eb', marginBottom: 16 },
  productTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 4 },
  productBrand: { fontSize: 16, color: '#6366f1', marginBottom: 2 },
  productQuantity: { fontSize: 14, color: '#666', marginBottom: 8 },
  healthBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, marginTop: 8 },
  healthBadgeText: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginRight: 8 },
  healthBadgeLabel: { color: '#fff', fontSize: 14 },
  section: { marginHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  nutrientRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  nutrientIcon: { fontSize: 22, width: 32, textAlign: 'center' },
  nutrientLabel: { fontSize: 16, flex: 1 },
  nutrientValue: { fontSize: 16, fontWeight: 'bold', minWidth: 60, textAlign: 'right' },
  ingredientsText: { color: '#444', fontSize: 15, marginTop: 4 },
  badgesRow: { flexDirection: 'row', marginHorizontal: 20, marginTop: 16, flexWrap: 'wrap' },
  badge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6, marginRight: 8, marginBottom: 8 },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  feedbackSection: { marginTop: 32, alignItems: 'center' },
  feedbackTitle: { fontSize: 16, color: '#333', marginBottom: 10, textAlign: 'center' },
  feedbackButtons: { flexDirection: 'row', justifyContent: 'center' },
  feedbackButton: { padding: 12, marginHorizontal: 10, backgroundColor: '#f3f4f6', borderRadius: 20 },
  thumbsUp: { fontSize: 22 },
  thumbsDown: { fontSize: 22 },
  bottomSpacing: { height: 40 },
});

export default FoodProductPage; 