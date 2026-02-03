import { apiClient } from './api';
import { User, AuthTokens } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'CLIENT' | 'VENDOR';
  isAdult: boolean;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    emailVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    // Backend expects isAdultConfirmed instead of isAdult
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      isAdultConfirmed: data.isAdult,
    };
    const response = await apiClient.post<AuthResponse>('/auth/register', payload);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await apiClient.post<AuthTokens>('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },

  async logout(): Promise<void> {
    // Just clear local storage - backend doesn't need to know
  },
};

export default authService;
