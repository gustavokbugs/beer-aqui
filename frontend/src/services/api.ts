import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, STORAGE_KEYS } from '@/constants';

class ApiClient {
  private client: AxiosInstance;
  private tokenPromise: Promise<string | null> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private async getToken(): Promise<string | null> {
    // Se já existe uma Promise em andamento, aguarda ela
    if (this.tokenPromise) {
      return this.tokenPromise;
    }

    // Cria uma nova Promise para buscar o token
    this.tokenPromise = AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    try {
      const token = await this.tokenPromise;
      return token;
    } finally {
      // Limpa a Promise após completar
      this.tokenPromise = null;
    }
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      async config => {
        console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
        const token = await this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      response => {
        console.log('✅ API Response:', response.config.method?.toUpperCase(), response.config.url, response.status);
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;
        
        console.error('❌ Response error:', error.config?.method?.toUpperCase(), error.config?.url, error.response?.status, error.message);
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          console.log('🔄 Attempting token refresh...');
          originalRequest._retry = true;
          
          try {
            // Token expired - try to refresh
            const newAccessToken = await this.handleTokenRefresh();
            console.log('✅ Token refreshed successfully');
            
            // Retry original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            
            return this.client(originalRequest);
          } catch (refreshError) {
            console.error('❌ Token refresh failed:', refreshError);
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  private async handleTokenRefresh() {
    try {
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

      return accessToken;
    } catch (error) {
      // Refresh failed - clear tokens and redirect to login
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
      throw error;
    }
  }

  get instance() {
    return this.client;
  }
}

export const apiClient = new ApiClient().instance;
