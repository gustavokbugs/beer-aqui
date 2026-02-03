import { apiClient } from './api';
import { Vendor } from '@/types';

export interface SearchNearbyParams {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  type?: string;
}

export const vendorService = {
  async searchNearby(params: SearchNearbyParams): Promise<{ vendors: Vendor[] }> {
    const response = await apiClient.get<{ vendors: Vendor[] }>('/vendors/nearby', {
      params,
    });
    return response.data;
  },

  async getById(id: string): Promise<Vendor> {
    const response = await apiClient.get<Vendor>(`/vendors/${id}`);
    return response.data;
  },
};
