import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEYS = {
  ACCESS: 'accessToken',
  REFRESH: 'refreshToken',
} as const;

// Đơn giản hóa error handling
const handleStorageOperation = async <T>(
  operation: () => Promise<T>,
  errorMessage: string,
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    console.error(`Error ${errorMessage}:`, error);
    return null;
  }
};

export const saveAccessToken = (token: string) =>
  handleStorageOperation(
    () => AsyncStorage.setItem(TOKEN_KEYS.ACCESS, token),
    'saving access token',
  );

export const getAccessToken = () =>
  handleStorageOperation(
    () => AsyncStorage.getItem(TOKEN_KEYS.ACCESS),
    'getting access token',
  );

export const removeAccessToken = () =>
  handleStorageOperation(
    () => AsyncStorage.removeItem(TOKEN_KEYS.ACCESS),
    'removing access token',
  );

export const saveRefreshToken = (token: string) =>
  handleStorageOperation(
    () => AsyncStorage.setItem(TOKEN_KEYS.REFRESH, token),
    'saving refresh token',
  );

export const getRefreshToken = () =>
  handleStorageOperation(
    () => AsyncStorage.getItem(TOKEN_KEYS.REFRESH),
    'retrieving refresh token',
  );

export const clearTokens = () =>
  handleStorageOperation(
    () => AsyncStorage.multiRemove([TOKEN_KEYS.ACCESS, TOKEN_KEYS.REFRESH]),
    'clearing tokens',
  );

export const isTokenExpired = (token: string): boolean => {
  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload));
    return Date.now() > decoded.exp * 1000;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};
