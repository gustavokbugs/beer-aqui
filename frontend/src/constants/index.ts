import Constants from 'expo-constants';

// Detecta automaticamente o IP do servidor Expo
const getApiUrl = () => {
  // Se estiver em produção, use a URL de produção
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Em desenvolvimento, detecta o IP automaticamente
  const expoHost = Constants.expoConfig?.hostUri?.split(':')[0];
  
  if (expoHost) {
    // Usa o mesmo IP do Expo Metro Bundler
    return `http://${expoHost}:3000/api/v1`;
  }

  // Fallback para localhost
  return 'http://localhost:3000/api/v1';
};

export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  TIMEOUT: 60000, // 60 segundos
};

export const MAP_CONFIG = {
  DEFAULT_LATITUDE: -23.550520,
  DEFAULT_LONGITUDE: -46.633308,
  DEFAULT_ZOOM: 15,
  SEARCH_RADIUS_KM: 5,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@BeerAqui:authToken',
  REFRESH_TOKEN: '@BeerAqui:refreshToken',
  USER_DATA: '@BeerAqui:userData',
  LANGUAGE: '@BeerAqui:language',
};

export const BEER_VOLUMES = [269, 350, 473, 600, 1000]; // ml

export const VENDOR_TYPES = {
  BAR: 'bar',
  MARKET: 'mercado',
  DISTRIBUTOR: 'distribuidora',
} as const;
