import { create } from 'zustand';
import { Product, SearchFilters } from '@/types';
import { productService } from '@/services/product.service';

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  filters: SearchFilters;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;

  searchProducts: (filters: SearchFilters) => Promise<void>;
  loadMoreProducts: () => Promise<void>;
  getProductById: (id: string) => Promise<void>;
  setFilters: (filters: SearchFilters) => void;
  clearFilters: () => void;
  clearError: () => void;
}

const initialFilters: SearchFilters = {
  radiusKm: 5,
};

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  selectedProduct: null,
  filters: initialFilters,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  page: 1,
  limit: 20,
  total: 0,
  hasMore: false,

  searchProducts: async (filters: SearchFilters) => {
    set({ isLoading: true, error: null });
    try {
      const normalizedFilters = { ...filters, page: 1, limit: filters.limit || get().limit || 20 };
      const response = await productService.search(normalizedFilters);
      set({
        products: response.products,
        filters: normalizedFilters,
        isLoading: false,
        page: response.page,
        limit: response.limit,
        total: response.total,
        hasMore: response.page * response.limit < response.total,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Search failed',
        isLoading: false,
      });
    }
  },

  loadMoreProducts: async () => {
    const state = get();
    if (state.isLoading || state.isLoadingMore || !state.hasMore) {
      return;
    }

    set({ isLoadingMore: true, error: null });
    try {
      const nextPage = state.page + 1;
      const response = await productService.search({
        ...state.filters,
        page: nextPage,
        limit: state.limit,
      });

      set({
        products: [...state.products, ...response.products],
        isLoadingMore: false,
        page: response.page,
        limit: response.limit,
        total: response.total,
        hasMore: response.page * response.limit < response.total,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Search failed',
        isLoadingMore: false,
      });
    }
  },

  getProductById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const product = await productService.getById(id);
      set({
        selectedProduct: product,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to load product',
        isLoading: false,
      });
    }
  },

  setFilters: (filters: SearchFilters) => {
    set({ filters: { ...get().filters, ...filters } });
  },

  clearFilters: () => {
    set({ filters: initialFilters, page: 1, total: 0, hasMore: false });
  },

  clearError: () => set({ error: null }),
}));
