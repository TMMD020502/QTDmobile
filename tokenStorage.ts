import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEYS = {
  ACCESS: 'accessToken',
  REFRESH: 'refreshToken',

  FINANCIALINFOAPPROVALPROCESSID: 'financialinfoapprovalprocessid',
  FINANCIADOCUMENTID: 'documentId',
  CREDITRATINGDOCUMENTID: 'documentId',
  ADDASSETSAPPROVALPROCESSID: 'addAssetsApprovalProcessId',
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

export const getFinancialInfoApprovalProcessId = () =>
  handleStorageOperation(
    () => AsyncStorage.getItem(TOKEN_KEYS.FINANCIALINFOAPPROVALPROCESSID),
    'getting access LoanPlanApprovalProcessId',
  );
export const saveFinancialInfoApprovalProcessId = (
  financialinfoAprovalProcessId: string,
) =>
  handleStorageOperation(
    () =>
      AsyncStorage.setItem(
        TOKEN_KEYS.FINANCIALINFOAPPROVALPROCESSID,
        financialinfoAprovalProcessId,
      ),
    'saving access LoanPlanApprovalProcessId',
  );

export const saveFinanciaDocumentIds = (documentIds: string[]) =>
  handleStorageOperation(
    () =>
      AsyncStorage.setItem(
        TOKEN_KEYS.FINANCIADOCUMENTID,
        JSON.stringify(documentIds), // Chuyển đổi mảng thành chuỗi JSON
      ),
    'saving document IDs',
  );
export const getFinanciaDocumentIds = async (): Promise<string[] | null> =>
  handleStorageOperation(async () => {
    const storedIds = await AsyncStorage.getItem(TOKEN_KEYS.FINANCIADOCUMENTID);
    return storedIds ? JSON.parse(storedIds) : []; // Chuyển đổi chuỗi JSON thành mảng
  }, 'getting document IDs');

export const saveAddAssetsApprovalProcessId = (
  AddAssetsApprovalProcessId: string,
) =>
  handleStorageOperation(
    () =>
      AsyncStorage.setItem(
        TOKEN_KEYS.ADDASSETSAPPROVALPROCESSID,
        AddAssetsApprovalProcessId,
      ),
    'saving AssetsApprovalProcessId',
  );

export const getAddAssetsApprovalProcessId = () =>
  handleStorageOperation(
    () => AsyncStorage.getItem(TOKEN_KEYS.ADDASSETSAPPROVALPROCESSID),
    'getting AssetsApprovalProcessId',
  );

export const clearAccessApprovalProcessIdn = async () => {
  await handleStorageOperation(
    () =>
      AsyncStorage.multiRemove([
        TOKEN_KEYS.FINANCIALINFOAPPROVALPROCESSID,
        TOKEN_KEYS.ADDASSETSAPPROVALPROCESSID,
      ]),
    'clearing ApprovalProcessId',
  );
  clearFinanciaDocumentIds();
};
export const clearFinanciaDocumentIds = () =>
  handleStorageOperation(
    () => AsyncStorage.removeItem(TOKEN_KEYS.FINANCIADOCUMENTID),
    'clearing document IDs',
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
