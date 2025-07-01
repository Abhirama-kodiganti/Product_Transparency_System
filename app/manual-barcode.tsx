import { formatProductInfo, searchProductByBarcode } from '@/utils/barcodeUtils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ManualBarcodeScreen() {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const router = useRouter();

  const handleSearch = async () => {
    if (!barcodeInput.trim()) {
      Alert.alert('Error', 'Please enter a barcode number');
      return;
    }

    setIsSearching(true);
    try {
      const result = await searchProductByBarcode(barcodeInput.trim());
      setLastResult(result);

      if (result.success && result.product) {
        const productInfo = formatProductInfo(result.product);
        Alert.alert(
          'Product Found!',
          productInfo,
          [
            {
              text: 'View Details',
              onPress: () => {
                // Navigate to product details page
                console.log('Navigate to product:', result.product);
              },
            },
            {
              text: 'Search Again',
              onPress: () => {
                setBarcodeInput('');
                setLastResult(null);
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Product Not Found',
          result.message || 'This product is not in our database.',
          [
            {
              text: 'Try Again',
              onPress: () => setBarcodeInput(''),
            },
            {
              text: 'Add Product',
              onPress: () => {
                console.log('Add product with barcode:', barcodeInput);
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Search Error',
        'Failed to search for product. Please try again.',
        [
          {
            text: 'OK',
          },
        ]
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleScanBarcode = () => {
    router.push('/barcode-scanner');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manual Barcode Search</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Ionicons name="information-circle" size={24} color="#6366f1" />
          <Text style={styles.instructionsText}>
            Enter a barcode number to search for product information from Open Food Facts database.
          </Text>
        </View>

        {/* Input Section */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Barcode Number</Text>
          <TextInput
            style={styles.barcodeInput}
            value={barcodeInput}
            onChangeText={setBarcodeInput}
            placeholder="Enter barcode number (e.g., 3017620422003)"
            placeholderTextColor="#999"
            keyboardType="numeric"
            autoFocus
            maxLength={20}
          />
          
          <TouchableOpacity 
            style={[styles.searchButton, isSearching && styles.searchButtonDisabled]} 
            onPress={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <Text style={styles.searchButtonText}>Searching...</Text>
            ) : (
              <>
                <Ionicons name="search" size={20} color="#fff" />
                <Text style={styles.searchButtonText}>Search Product</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.quickActionButton} onPress={handleScanBarcode}>
            <Ionicons name="scan" size={24} color="#6366f1" />
            <Text style={styles.quickActionText}>Scan Barcode</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => setBarcodeInput('3017620422003')}
          >
            <Ionicons name="clipboard" size={24} color="#6366f1" />
            <Text style={styles.quickActionText}>Try Sample Barcode</Text>
          </TouchableOpacity>
        </View>

        {/* Last Result */}
        {lastResult && (
          <View style={styles.resultContainer}>
            <Text style={styles.sectionTitle}>Last Search Result</Text>
            <View style={styles.resultCard}>
              <Text style={styles.resultBarcode}>Barcode: {lastResult.barcode}</Text>
              <Text style={styles.resultStatus}>
                Status: {lastResult.success ? 'Found' : 'Not Found'}
              </Text>
              {lastResult.success && lastResult.product && (
                <Text style={styles.resultInfo}>
                  {lastResult.product.product_name || 'Unknown Product'}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Supported Formats */}
        <View style={styles.formatsContainer}>
          <Text style={styles.sectionTitle}>Supported Barcode Formats</Text>
          <View style={styles.formatList}>
            <Text style={styles.formatItem}>• EAN-13 (13 digits)</Text>
            <Text style={styles.formatItem}>• EAN-8 (8 digits)</Text>
            <Text style={styles.formatItem}>• UPC-A (12 digits)</Text>
            <Text style={styles.formatItem}>• UPC-E (8 digits)</Text>
            <Text style={styles.formatItem}>• Code 128</Text>
            <Text style={styles.formatItem}>• Code 39</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  instructionsText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  barcodeInput: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    paddingVertical: 15,
    borderRadius: 10,
    gap: 8,
  },
  searchButtonDisabled: {
    backgroundColor: '#ccc',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  quickActionsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quickActionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  resultContainer: {
    marginBottom: 30,
  },
  resultCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  resultBarcode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  resultStatus: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  resultInfo: {
    fontSize: 14,
    color: '#333',
  },
  formatsContainer: {
    marginBottom: 30,
  },
  formatList: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
  },
  formatItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
}); 