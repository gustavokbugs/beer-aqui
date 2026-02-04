import { apiClient } from './api';
import { Product, SearchFilters } from '@/types';

export interface SearchProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export const productService = {
  async search(filters: SearchFilters): Promise<SearchProductsResponse> {
    const params: any = {};

    if (filters.brand) params.brand = filters.brand;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.volumeMl) params.volume = filters.volumeMl;
    if (filters.vendorId) params.vendorId = filters.vendorId;
    if (filters.state) params.state = filters.state;
    if (filters.city) params.city = filters.city;
    if (filters.neighborhood) params.neighborhood = filters.neighborhood;

    params.page = 1;
    params.limit = 50;

    const response = await apiClient.get<SearchProductsResponse>('/products/search', {
      params,
    });
    return response.data;
  },

  async getSuggestions(query: string): Promise<string[]> {
    if (!query || query.length < 2) {
      return [];
    }
    const response = await apiClient.get<{ suggestions: string[] }>('/products/suggestions', {
      params: { q: query, limit: 10 },
    });
    return response.data.suggestions;
  },

  async getById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  async getByBrand(brand: string): Promise<SearchProductsResponse> {
    const response = await apiClient.get<SearchProductsResponse>(
      `/products/brands/${brand}`
    );
    return response.data;
  },

  async getByVendor(vendorId: string): Promise<SearchProductsResponse> {
    const response = await apiClient.get<SearchProductsResponse>(
      `/products/vendors/${vendorId}/products`
    );
    return response.data;
  },
};

export default productService;
