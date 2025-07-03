import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

interface MapPreviewProps {
  latitude: number;
  longitude: number;
  onConfirm?: (lat: number, lon: number) => void;
  onRegionChange?: (lat: number, lon: number) => void;
}

const MapPreview: React.FC<MapPreviewProps> = ({ latitude, longitude, onConfirm, onRegionChange }) => {
  const [region, setRegion] = useState<Region>({
    latitude,
    longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  // Update region if props change (e.g., new suggestion selected)
  useEffect(() => {
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  }, [latitude, longitude]);

  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
    if (onRegionChange) {
      onRegionChange(newRegion.latitude, newRegion.longitude);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={handleRegionChange}
      >
        {/* Marker at the center of the map */}
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
      </MapView>
      {onConfirm && (
        <View style={styles.buttonContainer}>
          <Button
            title="Confirm Location"
            onPress={() => {
              console.log('Reporting location:', region.latitude, region.longitude, 'address');
              onConfirm(region.latitude, region.longitude);
            }}
            color="#2575fc"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 10,
    backgroundColor: '#232526',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default MapPreview; 