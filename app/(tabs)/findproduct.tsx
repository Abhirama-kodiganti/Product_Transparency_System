import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, KeyboardAvoidingView, Linking, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapPreview from '../../components/MapPreview';

interface Sighting {
  _id?: string;
  id?: number;
  lat: number;
  lon: number;
  timestamp: string;
}

// Add interface for LocationIQ Autocomplete suggestion
interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
  // other fields can be added if needed
}

const BACKEND_URL = 'http://192.168.29.69:4000';
const LOCATIONIQ_TOKEN = 'pk.b02ebfedceebcea0b417b4b737b2fdac'; // TODO: Replace with your actual LocationIQ token

const FindProductScreen = () => {
  const [productId, setProductId] = useState('');
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [previewLat, setPreviewLat] = useState<number | null>(null);
  const [previewLon, setPreviewLon] = useState<number | null>(null);
  const [locationConfirmed, setLocationConfirmed] = useState(false);

  const fetchSightings = async () => {
    if (!productId) {
      Alert.alert('Please enter a product ID');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/sightings?productId=${encodeURIComponent(productId)}`);
      const data = await res.json();
      if (data.sightings) {
        setSightings(data.sightings);
      } else {
        setSightings([]);
        setError('No sightings found');
      }
    } catch (e) {
      setError('Failed to fetch sightings');
    }
    setLoading(false);
  };

  const openInMaps = (lat: number, lon: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    Linking.openURL(url);
  };

  const reportMyLocation = async () => {
    if (!productId) {
      Alert.alert('Please enter a product ID');
      return;
    }
    setReportLoading(true);
    setError('');
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        setReportLoading(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      const res = await fetch(`${BACKEND_URL}/sighting`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          lat: location.coords.latitude,
          lon: location.coords.longitude
        })
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', 'Your location has been reported!');
      } else {
        setError(data.error || 'Failed to report location');
      }
    } catch (e) {
      setError('Failed to report location');
    }
    setReportLoading(false);
  };

  const fetchSuggestions = async (text: string) => {
    setAddress(text);
    setSelectedSuggestion(null);
    setLocationConfirmed(false);
    if (text.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://us1.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_TOKEN}&q=${encodeURIComponent(text)}&limit=5`
      );
      const data: Suggestion[] = await res.json();
      if (Array.isArray(data)) {
        setSuggestions(data);
      } else {
        setSuggestions([]);
      }
    } catch (e) {
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (item: Suggestion) => {
    setAddress(item.display_name);
    setSelectedSuggestion(item);
    setSuggestions([]);
    setPreviewLat(parseFloat(item.lat));
    setPreviewLon(parseFloat(item.lon));
    setLocationConfirmed(false);
  };

  const geocodeAddressAndReport = async () => {
    if (!productId) {
      Alert.alert('Please enter a product ID');
      return;
    }
    if (!address) {
      setAddressError('Please enter an address');
      return;
    }
    if (!locationConfirmed) {
      setAddressError('Please confirm the location on the map');
      return;
    }
    setAddressLoading(true);
    setAddressError('');
    try {
      let lat = previewLat;
      let lon = previewLon;
      if (lat == null || lon == null) {
        setAddressError('Could not determine location');
        setAddressLoading(false);
        return;
      }
      // Report to backend
      console.log('Reporting location:', lat, lon, address);
      const backendRes = await fetch(`${BACKEND_URL}/sighting`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          lat,
          lon
        })
      });
      const backendData = await backendRes.json();
      if (backendRes.ok) {
        Alert.alert('Success', 'Location reported!');
        setModalVisible(false);
        setAddress('');
        setSuggestions([]);
        setSelectedSuggestion(null);
        setPreviewLat(null);
        setPreviewLon(null);
        setLocationConfirmed(false);
      } else {
        setAddressError(backendData.error || 'Failed to report location');
      }
    } catch (e) {
      setAddressError('Failed to geocode address');
    }
    setAddressLoading(false);
  };

  const handleReportLocationPress = () => {
    setModalVisible(true);
  };

  const handleUseCurrentLocation = async () => {
    setModalVisible(false);
    await reportMyLocation();
  };

  // Helper to get preview latitude and longitude as numbers
  const getPreviewLat = () => {
    if (previewLat !== null) return previewLat;
    if (selectedSuggestion && typeof selectedSuggestion.lat === 'string') {
      const n = parseFloat(selectedSuggestion.lat);
      return isNaN(n) ? undefined : n;
    }
    return undefined;
  };
  const getPreviewLon = () => {
    if (previewLon !== null) return previewLon;
    if (selectedSuggestion && typeof selectedSuggestion.lon === 'string') {
      const n = parseFloat(selectedSuggestion.lon);
      return isNaN(n) ? undefined : n;
    }
    return undefined;
  };

  // Reverse geocode and update address when map region changes
  const handleMapRegionChange = async (lat: number, lon: number) => {
    setPreviewLat(lat);
    setPreviewLon(lon);
    setAddressLoading(true);
    try {
      const res = await fetch(
        `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_TOKEN}&lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      }
    } catch (e) {
      // Optionally handle error
    }
    setAddressLoading(false);
  };

  return (
    <LinearGradient
      colors={["#232526", "#414345", "#6a11cb", "#2575fc"]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Find Product Locations</Text>
        <TextInput
          placeholder="Enter Product ID"
          placeholderTextColor="#eee"
          value={productId}
          onChangeText={setProductId}
          style={styles.input}
        />
        <View style={styles.buttonContainer}>
          <Button title="Find Locations" color={Platform.OS === 'ios' ? undefined : '#6a11cb'} onPress={fetchSightings} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Report the Location of the product " color={Platform.OS === 'ios' ? undefined : '#2575fc'} onPress={handleReportLocationPress} disabled={reportLoading || !productId} />
        </View>
        {/* Modal for reporting location */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Report Product Location</Text>
              <TouchableOpacity style={styles.modalButton} onPress={handleUseCurrentLocation}>
                <Text style={styles.modalButtonText}>Use My Current Location</Text>
              </TouchableOpacity>
              <Text style={{ color: '#fff', marginVertical: 8, textAlign: 'center' }}>OR</Text>
              <View style={{ width: '100%' }}>
                <TextInput
                  placeholder="Enter Address"
                  placeholderTextColor="#eee"
                  value={address}
                  onChangeText={fetchSuggestions}
                  style={styles.input}
                  autoCorrect={false}
                  autoCapitalize="none"
                  editable={!addressLoading}
                />
                {addressLoading && <ActivityIndicator size="small" color="#fff" style={{ marginTop: 4 }} />}
                {/* Suggestions dropdown */}
                {suggestions.length > 0 && (
                  <View style={styles.suggestionsDropdown}>
                    {suggestions.map((item, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.suggestionItem}
                        onPress={() => handleSuggestionSelect(item)}
                      >
                        <Text style={{ color: '#fff' }}>{item.display_name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              {/* Map Preview for confirmation */}
              {getPreviewLat() !== undefined && getPreviewLon() !== undefined ? (
                <MapPreview
                  latitude={getPreviewLat() ?? 0}
                  longitude={getPreviewLon() ?? 0}
                  onConfirm={(lat, lon) => {
                    setPreviewLat(lat);
                    setPreviewLon(lon);
                    setLocationConfirmed(true);
                    setAddressError('');
                  }}
                  onRegionChange={handleMapRegionChange}
                />
              ) : null}
              {addressError ? <Text style={styles.error}>{addressError}</Text> : null}
              <TouchableOpacity style={styles.modalButton} onPress={geocodeAddressAndReport} disabled={addressLoading}>
                <Text style={styles.modalButtonText}>{addressLoading ? 'Reporting...' : locationConfirmed ? 'Report This Address' : 'Confirm Location Above'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#888', marginTop: 10 }]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>
        {loading && <ActivityIndicator style={{ marginTop: 20 }} color="#fff" />}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <FlatList
          data={sightings}
          keyExtractor={item => (item._id ? item._id.toString() : Math.random().toString())}
          style={{ marginTop: 20 }}
          renderItem={({ item }) => (
            <View style={styles.sightingCard}>
              <Text style={styles.sightingText}>Latitude: {item.lat}</Text>
              <Text style={styles.sightingText}>Longitude: {item.lon}</Text>
              <Text style={styles.sightingText}>Last seen: {new Date(item.timestamp).toLocaleString()}</Text>
              <View style={styles.buttonContainer}>
                <Button title="Take me there" color={Platform.OS === 'ios' ? undefined : '#43e97b'} onPress={() => openInMaps(item.lat, item.lon)} />
              </View>
            </View>
          )}
          ListEmptyComponent={() => (!loading ? <Text style={styles.sightingText}>No sightings yet.</Text> : null)}
        />
        {reportLoading && <ActivityIndicator style={{ marginTop: 10 }} color="#fff" />}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  buttonContainer: {
    marginVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },
  error: {
    color: '#ffb347',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  sightingCard: {
    marginBottom: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sightingText: {
    color: '#fff',
    marginBottom: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#232526',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#2575fc',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 4,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  suggestionsDropdown: {
    backgroundColor: '#232526',
    borderRadius: 8,
    marginTop: 2,
    maxHeight: 150,
    overflow: 'scroll',
    borderWidth: 1,
    borderColor: '#444',
    zIndex: 10,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
});

export default FindProductScreen; 