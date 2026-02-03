import { apiClient } from './api';
import { Product, SearchFilters } from '@/types';

export const productService = {
  async search(filters: SearchFilters): Promise<{ products: Product[] }> {
    const response = await apiClient.get<{ products: Product[] }>('/products/search', {
      params: filters,
    });
    return response.data;
  },

  async getById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  async getByBrand(brand: string): Promise<{ products: Product[] }> {
    const response = await apiClient.get<{ products: Product[] }>(
      `/products/brands/${brand}`
    );
    return response.data;
  },
};
