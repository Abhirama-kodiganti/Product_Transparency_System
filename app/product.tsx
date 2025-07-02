import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import FoodProductPage from "@/components/FoodProductPage";

export default function ProductPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let parsedProduct = null;
    if (params.product) {
      try {
        parsedProduct = JSON.parse(params.product as string);
      } catch {
        parsedProduct = null;
      }
    }

    if (parsedProduct) {
      setProduct(parsedProduct); // ✅ Scanner case (product passed directly)
    } else if (params.barcode) {
      setLoading(true); // ✅ Category case (barcode passed, need to fetch)
      fetch(`https://in.openfoodfacts.org/api/v2/product/${params.barcode}.json`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data.product || null);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch failed", err);
          setLoading(false);
        });
    }
  }, [params.product, params.barcode]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text style={styles.loadingText}>Loading Product...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Product not found.</Text>
      </View>
    );
  }

  return <FoodProductPage product={product} onBack={() => router.back()} />;
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  loadingText: { marginTop: 12, fontSize: 16, color: "#666" },
  errorText: { fontSize: 16, color: "#dc2626" },
});
