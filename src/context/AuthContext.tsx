import React, {createContext, useState, useContext, useEffect} from 'react';
import {AuthContextType, UserData} from '../types/auth.types';
import {authService} from '../services/auth.service';
import {getAccessToken, isTokenExpired} from '../../tokenStorage';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authService.setLogoutCallback(() => setIsAuthenticated(false));
    checkAuthState();

    // Không cần interval check vì đã có axiosInstance handling refresh token
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await getAccessToken();
      if (token) {
        if (isTokenExpired(token)) {
          const refreshed = await authService.refreshToken();
          if (!refreshed) {
            setIsAuthenticated(false);
            setError('Session expired. Please login again.');
          } else {
            setIsAuthenticated(true);
          }
        } else {
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (err: any) {
      console.log('Auth state check failed:', JSON.stringify(err.response));
      setIsAuthenticated(false);
      setError('Authentication check failed');
    } finally {
      setLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    loading,
    error,
    login: async (username, password) => {
      setLoading(true);
      try {
        const success = await authService.login(username, password);
        if (success) {
          setIsAuthenticated(true);
          return true;
        }
        return false;
      } catch (err: any) {
        setError(err.message);
        setIsAuthenticated(false);
        return false;
      } finally {
        setLoading(false);
      }
    },
    logout: async () => {
      try {
        await authService.logout();
        // setIsAuthenticated(false);
      } catch (err) {
        // Vẫn set isAuthenticated về false ngay cả khi có lỗi
        // vì người dùng có ý định logout
        setIsAuthenticated(false);
        setError('Có lỗi xảy ra khi đăng xuất');
        console.log('Logout error:', JSON.stringify(err));
      }
    },
    refreshToken: async () => {
      try {
        const result = await authService.refreshToken();
        if (!result) {
          setIsAuthenticated(false);
          setError('Failed to refresh token');
          return false;
        }
        return true;
      } catch (err) {
        setIsAuthenticated(false);
        setError('Failed to refresh token');
        return false;
      }
    },
    register: async (userData: UserData) => {
      setLoading(true);
      try {
        const result = await authService.register(userData);
        return result !== undefined ? result : false;
      } catch (err: any) {
        setError(err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
