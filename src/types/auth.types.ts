export interface UserData {
  phone: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  signatureImage?: string;
  identifyId: string;
  ethnicity?: string;
  religion?: string;
  gender: string;
  dateOfBirth: string;
  nationality?: string;
  placeOfBirth?: string;
  permanentAddress?: string;
  issueDate: string;
  expirationDate: string;
  issuingAuthority?: string;
  legalDocType?: string;
  frontImage?: string;
  backImage?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  register: (userData: UserData) => Promise<boolean>;
}
