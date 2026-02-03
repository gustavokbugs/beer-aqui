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
  companyName: string;
  type: 'bar' | 'mercado' | 'distribuidora';
  location: Location;
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phone?: string;
  isVerified: boolean;
  distance?: number; // em metros
}

export interface Product {
  id: string;
  vendorId: string;
  brand: string;
  volumeMl: number;
  price: number;
  isActive: boolean;
  stockQuantity?: number;
  description?: string;
  imageUrl?: string;
  vendor?: Vendor;
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
  radiusKm?: number;
}
