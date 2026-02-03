export const API_CONFIG = {
  BASE_URL: process.env.API_URL || 'http://localhost:3000/api/v1',
  TIMEOUT: 30000,
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
