import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CosmeticProductPageProps {
  product: any;
  onBack: () => void;
}

const getProductImage = (product: any) => {
  if (product?.image_front_url) return { uri: product.image_front_url };
  if (product?.image_url) return { uri: product.image_url };
  return { uri: 'https://i.pinimg.com/564x/2e/2d/2e/2e2d2e2d2e2d2e2d2e2d2e2d2e2d2e2d.jpg' };
};

const getBrand = (product: any) => product?.brands?.split(',')[0] || 'Unknown Brand';
const getQuantity = (product: any) => product?.quantity || 'Unknown Quantity';
const getIngredients = (product: any) => product?.ingredients_text || product?.ingredients_text_en || 'No ingredient info available.';

const CosmeticProductPage: React.FC<CosmeticProductPageProps> = ({ product, onBack }) => {
  const brand = getBrand(product);
  const quantity = getQuantity(product);
  const ingredients = getIngredients(product);
  const imageSource = getProductImage(product);

  // Extract cosmetic-specific information
  const categories = product?.categories_tags || [];
  const labels = product?.labels_tags || [];
  const allergens = product?.allergens || '';
  const traces = product?.traces || '';
  const additives = product?.additives_tags || [];

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
          <Text style={styles.productTitle}>
            {product.product_name || product.product_name_en || 'Unknown Product'}
          </Text>
          <Text style={styles.productBrand}>{brand}</Text>
          <Text style={styles.productQuantity}>{quantity}</Text>
        </View>

        {/* Categories */}
        {categories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.tagsContainer}>
              {categories.slice(0, 5).map((cat: string, idx: number) => (
                <View key={idx} style={styles.tag}>
                  <Text style={styles.tagText}>{cat.replace(/en:/g, '').replace(/-/g, ' ')}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <Text style={styles.ingredientsText}>{ingredients}</Text>
        </View>

        {/* Allergens & Traces */}
        {(allergens || traces) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Allergens & Traces</Text>
            {allergens && (
              <View style={styles.warningBox}>
                <Ionicons name="warning" size={20} color="#f59e0b" />
                <Text style={styles.warningText}>Allergens: {allergens}</Text>
              </View>
            )}
            {traces && (
              <View style={styles.warningBox}>
                <Ionicons name="information-circle" size={20} color="#6366f1" />
                <Text style={styles.warningText}>May contain traces of: {traces}</Text>
              </View>
            )}
          </View>
        )}

        {/* Additives */}
        {additives.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additives</Text>
            <View style={styles.tagsContainer}>
              {additives.map((additive: string, idx: number) => (
                <View key={idx} style={[styles.tag, styles.additiveTag]}>
                  <Text style={styles.tagText}>{additive.replace(/en:/g, '')}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Labels */}
        {labels.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Labels & Certifications</Text>
            <View style={styles.tagsContainer}>
              {labels.slice(0, 6).map((label: string, idx: number) => (
                <View key={idx} style={[styles.tag, styles.labelTag]}>
                  <Text style={styles.tagText}>{label.replace(/en:/g, '').replace(/-/g, ' ')}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Badges */}
        <View style={styles.badgesRow}>
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
          {product.cruelty_free && (
            <View style={[styles.badge, { backgroundColor: '#10d9c4' }]}>
              <Text style={styles.badgeText}>Cruelty Free</Text>
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
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15 
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  scrollView: { flex: 1 },
  productCard: { 
    backgroundColor: '#f8f9fa', 
    margin: 20, 
    borderRadius: 15, 
    padding: 20, 
    alignItems: 'center' 
  },
  productImage: { 
    width: 120, 
    height: 120, 
    borderRadius: 12, 
    backgroundColor: '#e5e7eb', 
    marginBottom: 16 
  },
  productTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#333', 
    textAlign: 'center', 
    marginBottom: 4 
  },
  productBrand: { fontSize: 16, color: '#fc8eac', marginBottom: 2 },
  productQuantity: { fontSize: 14, color: '#666', marginBottom: 8 },
  section: { marginHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  ingredientsText: { color: '#444', fontSize: 15, lineHeight: 22 },
  tagsContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginTop: 8 
  },
  tag: { 
    backgroundColor: '#f0f0f0', 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    marginRight: 8, 
    marginBottom: 8 
  },
  tagText: { 
    color: '#333', 
    fontSize: 12, 
    textTransform: 'capitalize' 
  },
  additiveTag: { 
    backgroundColor: '#fef3c7' 
  },
  labelTag: { 
    backgroundColor: '#dbeafe' 
  },
  warningBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fef3c7', 
    borderRadius: 12, 
    padding: 12, 
    marginBottom: 8 
  },
  warningText: { 
    color: '#92400e', 
    fontSize: 14, 
    marginLeft: 8, 
    flex: 1 
  },
  badgesRow: { 
    flexDirection: 'row', 
    marginHorizontal: 20, 
    marginTop: 16, 
    flexWrap: 'wrap' 
  },
  badge: { 
    borderRadius: 12, 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    marginRight: 8, 
    marginBottom: 8 
  },
  badgeText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 13 
  },
  feedbackSection: { 
    marginTop: 32, 
    alignItems: 'center' 
  },
  feedbackTitle: { 
    fontSize: 16, 
    color: '#333', 
    marginBottom: 10, 
    textAlign: 'center' 
  },
  feedbackButtons: { 
    flexDirection: 'row', 
    justifyContent: 'center' 
  },
  feedbackButton: { 
    padding: 12, 
    marginHorizontal: 10, 
    backgroundColor: '#f3f4f6', 
    borderRadius: 20 
  },
  thumbsUp: { fontSize: 22 },
  thumbsDown: { fontSize: 22 },
  bottomSpacing: { height: 40 },
});

export default CosmeticProductPage;

