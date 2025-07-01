import Camera from '@/components/Camera';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function CameraScreen() {
  return (
    <>
      <StatusBar style="light" />
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />
      <Camera />
    </>
  );
} 