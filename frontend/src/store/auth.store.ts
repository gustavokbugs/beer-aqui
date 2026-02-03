import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthTokens } from '@/types';
import { authService, LoginCredentials, RegisterData } from '@/services/auth.service';
import { STORAGE_KEYS } from '@/constants';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.AUTH_TOKEN, response.accessToken],
        [STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken],
        [STORAGE_KEYS.USER_DATA, JSON.stringify(response.user)],
      ]);

      set({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(data);

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.AUTH_TOKEN, response.accessToken],
        [STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken],
        [STORAGE_KEYS.USER_DATA, JSON.stringify(response.user)],
      ]);

      set({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Registration failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      error: null,
    });
  },

  loadStoredAuth: async () => {
    set({ isLoading: true });
    try {
      const [token, refreshToken, userData] = await AsyncStorage.multiGet([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);

      if (token[1] && userData[1]) {
        set({
          user: JSON.parse(userData[1]),
          accessToken: token[1],
          refreshToken: refreshToken[1],
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ 
          isAuthenticated: false,
          isLoading: false 
        });
      }
    } catch (error) {
      set({ 
        isAuthenticated: false,
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
}));
