export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CLIENT' | 'VENDOR' | 'ADMIN';
  emailVerified: boolean;
  isAdult: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Vendor {
  id: string;
  userId: string;
  companyName: string;
  cnpj?: string;
  type: 'bar' | 'mercado' | 'distribuidora';
  location: Location;
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
    zip: string;
  };
  phone?: string;
  isVerified: boolean;
  distance?: number; // em metros
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  vendorId: string;
  brand: string;
  volume: number; // Backend usa 'volume' em vez de 'volumeMl'
  volumeMl?: number; // Alias para compatibilidade
  volumeInLiters?: number;
  price: number;
  pricePerLiter?: number;
  isActive: boolean;
  stockQuantity?: number;
  description?: string;
  imageUrl?: string;
  vendor?: Vendor;
  createdAt?: string;
  updatedAt?: string;
}

export interface Ad {
  id: string;
  productId: string;
  product?: Product;
  priority: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
}

export interface SearchFilters {
  brand?: string;
  volumeMl?: number;
  minPrice?: number;
  maxPrice?: number;
  vendorType?: string;
  vendorId?: string;
  radiusKm?: number;
  page?: number;
  limit?: number;
}
