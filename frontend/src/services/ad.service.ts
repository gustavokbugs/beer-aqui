import { apiClient } from './api';
import { Ad } from '@/types';

export interface CreateAdPayload {
  productId: string;
  startDate: string;
  endDate: string;
  priority: number;
}

export interface ListActiveAdsResponse {
  ads: Ad[];
  total: number;
  page: number;
  limit: number;
}

export interface CancelAdResponse {
  success: boolean;
  message: string;
  refundEligible: boolean;
}

export const adService = {
  async create(payload: CreateAdPayload): Promise<Ad> {
    const response = await apiClient.post<Ad>('/ads', payload);
    return response.data;
  },

  async listActive(page = 1, limit = 50): Promise<ListActiveAdsResponse> {
    const response = await apiClient.get<ListActiveAdsResponse>('/ads/active', {
      params: { page, limit },
    });
    return response.data;
  },

  async cancel(adId: string): Promise<CancelAdResponse> {
    const response = await apiClient.post<CancelAdResponse>(`/ads/${adId}/cancel`);
    return response.data;
  },
};

export default adService;
