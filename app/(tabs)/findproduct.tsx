import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Linking, ActivityIndicator, Alert, StyleSheet, ImageBackground, Platform } from 'react-native';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';

interface Sighting {
  _id?: string;
  id?: number;
  lat: number;
  lon: number;
  timestamp: string;
}

const BACKEND_URL = 'http://192.168.29.69:4000';

const FindProductScreen = () => {
  const [productId, setProductId] = useState('');
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reportLoading, setReportLoading] = useState(false);

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
          <Button title="Report the Location of the product " color={Platform.OS === 'ios' ? undefined : '#2575fc'} onPress={reportMyLocation} disabled={reportLoading || !productId} />
        </View>
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
});

export default FindProductScreen; 