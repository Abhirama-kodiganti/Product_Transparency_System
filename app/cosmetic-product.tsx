import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import CosmeticProductPageComponent from "@/components/CosmeticProductPage";
import { BACKEND_URL } from "@/constants/Api";

export default function CosmeticProductPage() {
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
      setProduct(parsedProduct);
    } else if (params.barcode) {
      setLoading(true);
      fetch(`${BACKEND_URL}/cosmetic/${params.barcode}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.product) {
            setProduct(data.product);
          } else {
            setProduct(null);
          }
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
        <ActivityIndicator size="large" color="#fc8eac" />
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

  return <CosmeticProductPageComponent product={product} onBack={() => router.back()} />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  errorText: {
    color: "#999",
    fontSize: 16,
  },
});

