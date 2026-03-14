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
    const hasCoordinates =
      typeof filters.latitude === 'number' && typeof filters.longitude === 'number';

    if (filters.brand) params.brand = filters.brand;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.volumeMl) params.volume = filters.volumeMl;
    if (filters.vendorId) params.vendorId = filters.vendorId;
    if (filters.state) params.state = filters.state;
    if (filters.city) params.city = filters.city;
    if (filters.neighborhood) params.neighborhood = filters.neighborhood;

    if (hasCoordinates) {
      params.latitude = filters.latitude;
      params.longitude = filters.longitude;
      params.radiusInMeters = (filters.radiusKm || 5) * 1000;
    }

    params.page = 1;
    params.limit = 50;

    const endpoint = hasCoordinates ? '/products/nearby' : '/products/search';

    const response = await apiClient.get<SearchProductsResponse>(endpoint, {
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

  async getById(id: string): Promise<{ product: Product; vendor: any }> {
    const response = await apiClient.get<{ product: Product; vendor: any }>(`/products/${id}`);
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

  async getMyProducts(includeInactive = false): Promise<SearchProductsResponse> {
    const response = await apiClient.get<SearchProductsResponse>('/products/my-products', {
      params: { includeInactive },
    });
    return response.data;
  },

  async create(data: {
    brand: string;
    volume: number;
    price: number;
    stockQuantity: number;
    description?: string;
  }): Promise<Product> {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  },

  async toggleStatus(productId: string): Promise<Product> {
    const response = await apiClient.patch<Product>(`/products/${productId}/status`);
    return response.data;
  },
};

export default productService;
