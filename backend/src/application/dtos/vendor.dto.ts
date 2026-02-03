export interface CreateVendorDTO {
  userId: string;
  companyName: string;
  cnpj: string;
  type: 'bar' | 'mercado' | 'distribuidora';
  latitude: number;
  longitude: number;
  addressStreet: string;
  addressNumber: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  phone?: string;
}

export interface UpdateVendorDTO {
  companyName?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  addressStreet?: string;
  addressNumber?: string;
  addressCity?: string;
  addressState?: string;
  addressZip?: string;
}

export interface VendorResponseDTO {
  id: string;
  userId: string;
  companyName: string;
  cnpj: string;
  type: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
    zip: string;
  };
  phone?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchNearbyVendorsDTO {
  latitude: number;
  longitude: number;
  radiusInMeters: number;
  type?: 'bar' | 'mercado' | 'distribuidora';
  isVerified?: boolean;
  page?: number;
  limit?: number;
}
