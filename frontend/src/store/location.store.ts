import { create } from 'zustand';
import * as ExpoLocation from 'expo-location';
import { Location } from '@/types';
import { MAP_CONFIG } from '@/constants';

interface LocationState {
  currentLocation: Location | null;
  permissionGranted: boolean;
  isLoading: boolean;
  error: string | null;

  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<void>;
  setLocation: (location: Location) => void;
  clearError: () => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  currentLocation: null,
  permissionGranted: false,
  isLoading: false,
  error: null,

  requestPermission: async () => {
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      set({ permissionGranted: granted });
      return granted;
    } catch (error) {
      set({ error: 'Failed to request location permission' });
      return false;
    }
  },

  getCurrentLocation: async () => {
    set({ isLoading: true, error: null });
    try {
      const hasPermission = get().permissionGranted || (await get().requestPermission());

      if (!hasPermission) {
        // Use default location if permission denied
        set({
          currentLocation: {
            latitude: MAP_CONFIG.DEFAULT_LATITUDE,
            longitude: MAP_CONFIG.DEFAULT_LONGITUDE,
          },
          isLoading: false,
          error: 'Location permission denied. Using default location.',
        });
        return;
      }

      const location = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.Balanced,
      });

      set({
        currentLocation: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        currentLocation: {
          latitude: MAP_CONFIG.DEFAULT_LATITUDE,
          longitude: MAP_CONFIG.DEFAULT_LONGITUDE,
        },
        error: 'Failed to get location. Using default location.',
        isLoading: false,
      });
    }
  },

  setLocation: (location: Location) => {
    set({ currentLocation: location });
  },

  clearError: () => set({ error: null }),
}));
