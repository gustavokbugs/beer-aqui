import { create } from 'zustand';
import { Vendor } from '@/types';
import { vendorService, SearchNearbyParams } from '@/services/vendor.service';

interface VendorState {
  vendors: Vendor[];
  selectedVendor: Vendor | null;
  isLoading: boolean;
  error: string | null;
  searchNearby: (params: SearchNearbyParams) => Promise<void>;
  selectVendor: (vendor: Vendor | null) => void;
  getVendorById: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useVendorStore = create<VendorState>((set) => ({
  vendors: [],
  selectedVendor: null,
  isLoading: false,
  error: null,

  searchNearby: async (params: SearchNearbyParams) => {
    set({ isLoading: true, error: null });
    try {
      const response = await vendorService.searchNearby(params);
      set({ vendors: response.vendors, isLoading: false });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || 'Erro ao buscar estabelecimentos próximos',
        isLoading: false,
      });
    }
  },

  selectVendor: (vendor: Vendor | null) => {
    set({ selectedVendor: vendor });
  },

  getVendorById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const vendor = await vendorService.getById(id);
      set({ selectedVendor: vendor, isLoading: false });
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || 'Erro ao buscar estabelecimento',
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
