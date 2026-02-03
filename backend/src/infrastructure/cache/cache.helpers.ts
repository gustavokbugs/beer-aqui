/**
 * Cache Keys
 * Constantes para chaves do cache Redis
 */
export const CacheKeys = {
  // Vendors
  VENDOR_BY_ID: (id: string) => `vendor:${id}`,
  VENDOR_PROFILE: (id: string) => `vendor:profile:${id}`,
  VENDORS_NEARBY: (lat: number, lng: number, radius: number, type?: string) =>
    `vendors:nearby:${lat}:${lng}:${radius}${type ? `:${type}` : ''}`,

  // Products
  PRODUCT_BY_ID: (id: string) => `product:${id}`,
  PRODUCT_DETAILS: (id: string) => `product:details:${id}`,
  PRODUCTS_BY_VENDOR: (vendorId: string, page: number, limit: number) =>
    `products:vendor:${vendorId}:${page}:${limit}`,
  PRODUCTS_SEARCH: (filters: string) => `products:search:${filters}`,
  PRODUCTS_BY_BRAND: (brand: string, page: number) => `products:brand:${brand}:${page}`,

  // Ads
  ADS_ACTIVE: (page: number, limit: number) => `ads:active:${page}:${limit}`,
  ADS_BY_PRODUCT: (productId: string) => `ads:product:${productId}`,

  // Patterns for deletion
  VENDOR_PATTERN: (vendorId: string) => `*vendor*${vendorId}*`,
  PRODUCT_PATTERN: (productId: string) => `*product*${productId}*`,
  VENDOR_PRODUCTS_PATTERN: (vendorId: string) => `products:vendor:${vendorId}:*`,
  VENDORS_NEARBY_PATTERN: () => `vendors:nearby:*`,
  PRODUCTS_SEARCH_PATTERN: () => `products:search:*`,
  ADS_PATTERN: () => `ads:*`,
} as const;

/**
 * Cache TTL (Time to Live) em segundos
 */
export const CacheTTL = {
  // Curta duração (dados que mudam frequentemente)
  SHORT: 60, // 1 minuto
  PRODUCT_PRICE: 300, // 5 minutos
  
  // Média duração (dados que mudam ocasionalmente)
  MEDIUM: 900, // 15 minutos
  VENDOR_PROFILE: 1800, // 30 minutos
  PRODUCT_DETAILS: 600, // 10 minutos
  
  // Longa duração (dados estáveis)
  LONG: 3600, // 1 hora
  VENDORS_NEARBY: 1800, // 30 minutos
  PRODUCTS_SEARCH: 600, // 10 minutos
  ADS_ACTIVE: 300, // 5 minutos
  
  // Muito longa (dados raramente alterados)
  VERY_LONG: 86400, // 24 horas
} as const;

/**
 * Helper para criar hash de filtros de busca
 */
export function createSearchFiltersHash(filters: {
  brand?: string;
  volumeMl?: number;
  minPrice?: number;
  maxPrice?: number;
  vendorId?: string;
  page?: number;
  limit?: number;
}): string {
  const parts: string[] = [];
  
  if (filters.brand) parts.push(`b:${filters.brand}`);
  if (filters.volumeMl) parts.push(`v:${filters.volumeMl}`);
  if (filters.minPrice !== undefined) parts.push(`minp:${filters.minPrice}`);
  if (filters.maxPrice !== undefined) parts.push(`maxp:${filters.maxPrice}`);
  if (filters.vendorId) parts.push(`vid:${filters.vendorId}`);
  if (filters.page !== undefined) parts.push(`p:${filters.page}`);
  if (filters.limit !== undefined) parts.push(`l:${filters.limit}`);
  
  return parts.join(':') || 'all';
}

/**
 * Helper para invalidar cache relacionado a um vendedor
 */
export const invalidateVendorCache = async (
  cacheService: any,
  vendorId: string
): Promise<void> => {
  await Promise.all([
    cacheService.delPattern(CacheKeys.VENDOR_PATTERN(vendorId)),
    cacheService.delPattern(CacheKeys.VENDOR_PRODUCTS_PATTERN(vendorId)),
    cacheService.delPattern(CacheKeys.VENDORS_NEARBY_PATTERN()),
  ]);
};

/**
 * Helper para invalidar cache relacionado a um produto
 */
export const invalidateProductCache = async (
  cacheService: any,
  productId: string,
  vendorId?: string
): Promise<void> => {
  const promises = [
    cacheService.delPattern(CacheKeys.PRODUCT_PATTERN(productId)),
    cacheService.delPattern(CacheKeys.PRODUCTS_SEARCH_PATTERN()),
  ];

  if (vendorId) {
    promises.push(
      cacheService.delPattern(CacheKeys.VENDOR_PRODUCTS_PATTERN(vendorId))
    );
  }

  await Promise.all(promises);
};

/**
 * Helper para invalidar cache de anúncios
 */
export const invalidateAdsCache = async (
  cacheService: any
): Promise<void> => {
  await cacheService.delPattern(CacheKeys.ADS_PATTERN());
};
