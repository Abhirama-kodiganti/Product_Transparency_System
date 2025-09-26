import Constants from 'expo-constants';

function getHostFromExpo(): string | undefined {
  const expoConfig: any = (Constants as any).expoConfig || (Constants as any).manifest;
  const hostUri: string | undefined = expoConfig?.hostUri;
  if (!hostUri) return undefined;
  const host = hostUri.split(':')[0];
  return host;
}

const DEFAULT_BACKEND_PORT = 4000;
const DEFAULT_OCR_PORT = 3000;

const derivedHost = getHostFromExpo() || 'localhost';

export const BACKEND_URL: string =
  process.env.EXPO_PUBLIC_BACKEND_URL || `http://${derivedHost}:${DEFAULT_BACKEND_PORT}`;

export const OCR_URL: string =
  process.env.EXPO_PUBLIC_OCR_URL || `http://${derivedHost}:${DEFAULT_OCR_PORT}`;


