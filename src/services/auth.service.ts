import axios from 'axios';
import keycloakConfig from '../../keycloakConfig';
import {
  saveAccessToken,
  saveRefreshToken,
  getRefreshToken,
  clearTokens,
} from '../../tokenStorage';
import {UserData} from '../types/auth.types';

class AuthService {
  private static instance: AuthService;
  private logoutCallback?: () => void;
  private readonly keycloakTokenUrl: string;

  private constructor() {
    this.keycloakTokenUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`;
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  setLogoutCallback(callback: () => void) {
    this.logoutCallback = callback;
  }

  private createAuthParams(
    grantType: 'password' | 'refresh_token',
    params: Record<string, string>,
  ) {
    const urlParams = new URLSearchParams({
      grant_type: grantType,
      client_id: keycloakConfig.clientId,
      client_secret: keycloakConfig.clientSecret,
      ...params,
    });
    return urlParams.toString();
  }

  async login(username: string, password: string) {
    try {
      const params = this.createAuthParams('password', {
        username,
        password,
        scope: 'openid',
      });

      const response = await axios.post(this.keycloakTokenUrl, params, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      });

      if (response.status !== 200 || !response.data.access_token) {
        throw new Error('Invalid credentials');
      }

      await this.handleAuthResponse(response.data);
      return true;
    } catch (error: any) {
      console.log('Login error:', error.response);
      // Re-throw để component xử lý error
      throw error;
    }
  }

  async refreshToken() {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');

    const params = this.createAuthParams('refresh_token', {
      refresh_token: refreshToken,
    });

    const response = await axios.post(this.keycloakTokenUrl, params, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    });

    await this.handleAuthResponse(response.data);
    return true;
  }

  async logout() {
    try {
      await clearTokens();
      this.logoutCallback?.();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  private async handleAuthResponse(data: any) {
    await saveAccessToken(data.access_token);
    await saveRefreshToken(data.refresh_token);
  }

  async register(userData: UserData) {
    try {
      const transformedData = this.transformUserData(userData);

      const response = await axios.post(
        'https://tsoftware.store/api/v1/customers',
        transformedData,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      if (response.status === 200) {
        return true;
      }

      return false;
    } catch (error: any) {
      console.log('Error:', error.message);
      console.log('Error:', error.response);
    }
  }

  private transformUserData(userData: UserData) {
    return {
      username: userData.phone,
      password: userData.password,
      email: userData.email,
      phone: userData.phone,
      firstName: userData.firstName,
      lastName: userData.lastName,
      address: JSON.parse(userData.address),
      signaturePhoto: userData.signatureImage,
      identityInfo: {
        identifyId: userData.identifyId,
        fullName: `${userData.lastName} ${userData.firstName}`,
        ethnicity: userData.ethnicity || '',
        religion: userData.religion || '',
        gender: userData.gender === 'Nam' ? 'MALE' : 'FEMALE',
        dateOfBirth: this.convertDateFormat(userData.dateOfBirth),
        nationality: userData.nationality || 'VN',
        placeOfBirth: userData.placeOfBirth || '',
        permanentAddress: userData.permanentAddress || '',
        issueDate: this.convertDateFormat(userData.issueDate),
        expirationDate: this.convertDateFormat(userData.expirationDate),
        issuingAuthority: userData.issuingAuthority || '',
        legalDocType: userData.legalDocType || 'CCCD',
        frontPhotoUrl: userData.frontImage || '',
        backPhotoUrl: userData.backImage || '',
      },
    };
  }

  private convertDateFormat(dateStr: string): string {
    if (!dateStr) return '';
    if (dateStr.includes('-')) return `${dateStr}T00:00:00Z`;

    try {
      const [day, month, year] = dateStr.split('/');
      if (!day || !month || !year) return dateStr;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(
        2,
        '0',
      )}T00:00:00Z`;
    } catch (error) {
      console.error('Date conversion error:', error);
      return dateStr;
    }
  }
}

export const authService = AuthService.getInstance();
