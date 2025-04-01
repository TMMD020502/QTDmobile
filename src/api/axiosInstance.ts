import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from '../../tokenStorage';
import keycloakConfig from '../../keycloakConfig';
import {authService} from '../services/auth.service';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface ApiResponse<T = unknown> {
  result: T;
  message: string;
  status: number;
}

export type ApiRequestConfig<T = unknown> = InternalAxiosRequestConfig & {
  data?: T;
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://tsoftware.store/api/v1',
  timeout: 10000, // Tăng timeout lên 10s
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Thêm type cho config
interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Flag để theo dõi quá trình refresh token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (err: unknown) => void;
}> = [];

// Add navigation reference
// let navigationRef: any = null;

// export const setNavigationRef = (ref: any) => {
//   navigationRef = ref;
// };

// const navigateToLogin = () => {
//   if (navigationRef) {
//     navigationRef.navigate('Login');
//   }
// };

const processQueue = (error: unknown | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  <T>(response: AxiosResponse<ApiResponse<T>>) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as RetryConfig;

    // Handle 401 errors
    if (error.response?.status === 401) {
      if (!originalRequest || originalRequest._retry) {
        // If we've already tried to refresh, navigate to login
        await authService.logout();
        // navigateToLogin();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({resolve, reject});
          });
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          await authService.logout();
          // navigateToLogin();
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const params = new URLSearchParams();
        params.append('grant_type', 'refresh_token');
        params.append('client_id', keycloakConfig.clientId);
        params.append('client_secret', keycloakConfig.clientSecret);
        params.append('refresh_token', refreshToken);

        const response = await axios.post(
          `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`,
          params.toString(),
          {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          },
        );

        const newAccessToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token;

        await saveAccessToken(newAccessToken);
        await saveRefreshToken(newRefreshToken);

        processQueue(null, newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        await authService.logout();
        // navigateToLogin();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
