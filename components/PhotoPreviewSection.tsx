import { AntDesign } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PhotoPreviewSectionProps {
  photo: any;
  handleRetakePhoto: () => void;
  handleUsePhoto: () => void;
}

export default function PhotoPreviewSection({ photo, handleRetakePhoto, handleUsePhoto }: PhotoPreviewSectionProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: photo.uri }} style={styles.previewImage} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleRetakePhoto}>
          <AntDesign name='reload1' size={24} color='white' />
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.usePhotoButton]} onPress={handleUsePhoto}>
          <AntDesign name='check' size={24} color='white' />
          <Text style={styles.buttonText}>Use Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  previewImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'white',
  },
  usePhotoButton: {
    backgroundColor: 'rgba(34, 197, 94, 0.8)',
    borderColor: '#22c55e',
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
}); 