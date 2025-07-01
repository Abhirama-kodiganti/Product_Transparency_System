import FoodProductPage from '@/components/FoodProductPage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

export default function ProductPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  let product = null;
  try {
    product = params.product ? JSON.parse(params.product as string) : null;
  } catch (e) {
    product = null;
  }

  if (!product) {
    return <></>; // Or show a fallback UI
  }

  return <FoodProductPage product={product} onBack={() => router.back()} />;
} 