export interface CreateProductDTO {
  vendorId: string;
  brand: string;
  volume: number;
  price: number;
  stockQuantity: number;
  description?: string;
  imageUrl?: string;
}

export interface UpdateProductDTO {
  brand?: string;
  price?: number;
  stockQuantity?: number;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface VendorBasicDTO {
  id: string;
  companyName: string;
  type: string;
  city: string;
  state: string;
  neighborhood?: string;
  latitude: number;
  longitude: number;
}

export interface ProductResponseDTO {
  id: string;
  vendorId: string;
  brand: string;
  volume: number;
  volumeInLiters: number;
  price: number;
  pricePerLiter: number;
  isActive: boolean;
  stockQuantity: number;
  description?: string;
  imageUrl?: string;
  vendor?: VendorBasicDTO;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchProductsDTO {
  vendorId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  volume?: number;
  // Filtros de localiza\u00e7\u00e3o
  state?: string;
  city?: string;
  neighborhood?: string;
  page?: number;
  limit?: number;
}
