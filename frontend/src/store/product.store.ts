import { create } from 'zustand';
import { Product, SearchFilters } from '@/types';
import { productService } from '@/services/product.service';

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  filters: SearchFilters;
  isLoading: boolean;
  error: string | null;

  searchProducts: (filters: SearchFilters) => Promise<void>;
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
  error: null,

  searchProducts: async (filters: SearchFilters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.search(filters);
      set({
        products: response.products,
        filters,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Search failed',
        isLoading: false,
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
    set({ filters: initialFilters });
  },

  clearError: () => set({ error: null }),
}));
