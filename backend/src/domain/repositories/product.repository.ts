import { Product } from '../entities/product.entity';

export interface SearchProductsQuery {
  vendorId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  volume?: number;
  isActive?: boolean;
  limit?: number;
  offset?: number;
  state?: string;
  city?: string;
  neighborhood?: string;
}

export interface SearchNearbyProductsQuery {
  latitude: number;
  longitude: number;
  radiusInMeters: number;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  volume?: number;
  isActive?: boolean;
}

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  save(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
  findByVendorId(vendorId: string, page: number, limit: number): Promise<{
    products: Product[];
    total: number;
  }>;
  search(query: SearchProductsQuery, page: number, limit: number): Promise<{
    products: Array<{ product: Product; vendor: any }>;
    total: number;
  }>;
  findNearby(query: SearchNearbyProductsQuery, page: number, limit: number): Promise<{
    products: Array<{ product: Product; vendor: any }>;
    total: number;
  }>;
  findByBrand(brand: string, page: number, limit: number): Promise<{
    products: Product[];
    total: number;
  }>;
  findAllActive(page: number, limit: number): Promise<{ products: Product[]; total: number }>;
  searchBrandSuggestions(query: string, limit: number): Promise<string[]>;
}
