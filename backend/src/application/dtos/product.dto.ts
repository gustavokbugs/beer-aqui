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
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchProductsDTO {
  vendorId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  volume?: number;
  page?: number;
  limit?: number;
}
