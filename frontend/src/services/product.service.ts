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
    const params: any = {
      brand: filters.brand,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      volume: filters.volumeMl,
      vendorId: filters.vendorId,
      page: 1,
      limit: 50,
    };

    const response = await apiClient.get<SearchProductsResponse>('/products/search', {
      params,
    });
    return response.data;
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
