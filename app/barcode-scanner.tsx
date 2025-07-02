import { formatProductInfo, getBarcodeTypeName, processBarcodeData, searchProductByBarcode, validateBarcode } from '@/utils/barcodeUtils';
import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BarcodeScannerScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState<string>('');
  const [barcodeType, setBarcodeType] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  
  // Add refs to prevent multiple scans
  const isProcessingRef = useRef(false);
  const lastScannedDataRef = useRef<string>('');
  const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timeout on unmount - MUST be before any early returns
  useEffect(() => {
    // Reset scanner when component mounts/unmounts
    return () => {
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
      // Clear processing flags on unmount
      isProcessingRef.current = false;
      lastScannedDataRef.current = '';
    };
  }, []);

  // Add focus/blur effect to handle navigation
  useEffect(() => {
    const handleFocus = () => {
      // Component is focused (user came back to scanner)
      // Allow scanning after a brief delay
      setTimeout(() => {
        if (scanTimeoutRef.current) {
          clearTimeout(scanTimeoutRef.current);
        }
        isProcessingRef.current = false;
        lastScannedDataRef.current = '';
        setScanned(false);
        setIsSearching(false);
      }, 500);
    };

    const handleBlur = () => {
      // Component lost focus (user navigated away)
      // Immediately stop scanning
      isProcessingRef.current = true;
      setScanned(true); // This will disable the camera
    };

    // Listen for focus events if available
    // Note: This might need to be implemented differently based on your navigation setup
    
    return () => {
      // Cleanup
    };
  }, []);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color="#6366f1" />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need access to your camera to scan barcodes and QR codes.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    // Prevent multiple scans of the same barcode
    if (isProcessingRef.current || lastScannedDataRef.current === data || scanned) {
      return;
    }

    // Set processing flag immediately
    isProcessingRef.current = true;
    lastScannedDataRef.current = data;
    
    setScanned(true);
    setBarcodeData(data);
    setBarcodeType(type);
    
    // Process the barcode data
    const barcodeResult = processBarcodeData(data, type);
    const isValid = validateBarcode(data, type);
    const typeName = getBarcodeTypeName(type);
    
    if (!isValid) {
      Alert.alert(
        'Invalid Barcode',
        `The scanned ${typeName} appears to be invalid. Please try again.`,
        [
          {
            text: 'Scan Again',
            onPress: () => resetScanner(),
          },
        ]
      );
      return;
    }
    
    // Search for the product immediately
    handleSearchProduct(data);
  };

  const handleSearchProduct = async (barcodeData: string) => {
    setIsSearching(true);
    try {
      const result = await searchProductByBarcode(barcodeData);
      if (result.success && result.product) {
        const productInfo = formatProductInfo(result.product);
        Alert.alert(
          'Product Found!',
          productInfo,
          [
            {
              text: 'View Details',
              onPress: () => {
                // Immediately disable scanner
                isProcessingRef.current = true;
                setScanned(true);
                
                // Navigate to product details page
                router.push({ 
                  pathname: '/product', 
                  params: { product: JSON.stringify(result.product) } 
                });
                
                // Don't reset scanner here - let it reset when user returns
              },
            },
            {
              text: 'Scan Again',
              onPress: () => resetScanner(),
            },
          ],
          { cancelable: false } // Prevent accidental dismissal
        );
      } else {
        Alert.alert(
          'Product Not Found',
          result.message || 'This product is not in our database. Would you like to add it?',
          [
            {
              text: 'Add Product',
              onPress: () => {
                // Navigate to add product page
                resetScanner();
              },
            },
            {
              text: 'Scan Again',
              onPress: () => resetScanner(),
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Search Error',
        error?.message || 'Failed to search for product. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => resetScanner(),
          },
        ],
        { cancelable: false }
      );
    } finally {
      setIsSearching(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setBarcodeData('');
    setBarcodeType('');
    setIsSearching(false);
    
    // Reset processing state after a brief delay to prevent immediate re-scanning
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }
    
    scanTimeoutRef.current = setTimeout(() => {
      isProcessingRef.current = false;
      lastScannedDataRef.current = '';
    }, 2000); // Increased to 2 seconds for better UX
  };

  const handleScanAgain = () => {
    resetScanner();
  };

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing}
        onBarcodeScanned={scanned || isSearching ? undefined : handleBarcodeScanned}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Barcode</Text>
          <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Scan Frame Overlay */}
        <View style={styles.overlay}>
          <View style={styles.scanFrame}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
          </View>
          <Text style={styles.scanText}>Position barcode within the frame</Text>
          <Text style={styles.scanSubtext}>Supports QR codes, EAN, UPC, and more</Text>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomContainer}>
          {scanned && !isSearching && (
            <View style={styles.scannedInfo}>
              <Text style={styles.scannedText}>
                Last scanned: {barcodeData}
              </Text>
              <Text style={styles.scannedType}>
                Type: {getBarcodeTypeName(barcodeType)}
              </Text>
              <TouchableOpacity style={styles.scanAgainButton} onPress={handleScanAgain}>
                <Text style={styles.scanAgainText}>Scan Again</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {isSearching && (
            <View style={styles.searchingInfo}>
              <Text style={styles.searchingText}>Searching for product...</Text>
            </View>
          )}
          
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="flashlight" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="settings" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#fff',
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  flipButton: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 280,
    height: 280,
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#6366f1',
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#6366f1',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#6366f1',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#6366f1',
  },
  scanText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 30,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  scanSubtext: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  scannedInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  scannedText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
  },
  scannedType: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 10,
  },
  scanAgainButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  scanAgainText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchingInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  searchingText: {
    color: '#fff',
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  controlButton: {
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
  },
});