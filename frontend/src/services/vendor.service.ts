import { apiClient } from './api';
import { Vendor } from '@/types';

export interface SearchNearbyParams {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  type?: string;
}

export interface SearchNearbyResponse {
  vendors: Vendor[];
  total: number;
  page: number;
  limit: number;
}

export const vendorService = {
  async searchNearby(params: SearchNearbyParams): Promise<SearchNearbyResponse> {
    // Convert radiusKm to radiusInMeters for backend
    const radiusInMeters = (params.radiusKm || 5) * 1000;
    
    const queryParams = {
      latitude: params.latitude,
      longitude: params.longitude,
      radiusInMeters,
      type: params.type,
      page: 1,
      limit: 50,
    };

    const response = await apiClient.get<SearchNearbyResponse>('/vendors/nearby', {
      params: queryParams,
    });
    return response.data;
  },

  async getById(id: string): Promise<Vendor> {
    const response = await apiClient.get<Vendor>(`/vendors/${id}`);
    return response.data;
  },
};

export default vendorService;
