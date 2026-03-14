import { Request, Response, NextFunction } from 'express';
import { RedisCacheService } from '@/infrastructure/cache/redis.service';

export interface CacheOptions {
  ttl: number;
  keyGenerator?: (req: Request) => string;
}
export const cacheMiddleware = (options: CacheOptions) => {
  const cacheService = RedisCacheService.getInstance();

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.method !== 'GET') {
      next();
      return;
    }

    try {
      const cacheKey = options.keyGenerator
        ? options.keyGenerator(req)
        : `http:${req.method}:${req.originalUrl}`;

      const cachedData = await cacheService.get<any>(cacheKey);

      if (cachedData) {
        res.set('X-Cache', 'HIT');
        res.status(200).json(cachedData);
        return;
      }

      const originalJson = res.json.bind(res);

      res.json = function (data: any): Response {
        if (res.statusCode === 200) {
          cacheService.set(cacheKey, data, options.ttl).catch((error) => {
            console.error('Error caching response:', error);
          });
        }

        res.set('X-Cache', 'MISS');
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};
export const nearbyVendorsCacheKey = (req: Request): string => {
  const { latitude, longitude, radiusKm, type } = req.query;
  return `vendors:nearby:${latitude}:${longitude}:${radiusKm || 5}${type ? `:${type}` : ''}`;
};
export const productSearchCacheKey = (req: Request): string => {
  const { brand, volumeMl, volume, minPrice, maxPrice, vendorId, page, limit } = req.query;
  const parts: string[] = ['products:search'];
  
  if (brand) parts.push(`b:${brand}`);
  if (volumeMl) parts.push(`v:${volumeMl}`);
  if (volume) parts.push(`v:${volume}`);
  if (minPrice) parts.push(`minp:${minPrice}`);
  if (maxPrice) parts.push(`maxp:${maxPrice}`);
  if (vendorId) parts.push(`vid:${vendorId}`);
  parts.push(`p:${page || 1}`);
  parts.push(`l:${limit || 20}`);
  
  return parts.join(':');
};
export const vendorProductsCacheKey = (req: Request): string => {
  const { vendorId } = req.params;
  const { page, limit, includeInactive } = req.query;
  return `products:vendor:${vendorId}:${page || 1}:${limit || 20}${includeInactive ? ':inactive' : ''}`;
};
export const activeAdsCacheKey = (req: Request): string => {
  const { page, limit } = req.query;
  return `ads:active:${page || 1}:${limit || 20}`;
};

export const nearbyProductsCacheKey = (req: Request): string => {
  const { latitude, longitude, radiusInMeters, brand, volume, minPrice, maxPrice, page, limit } = req.query;
  const parts: string[] = ['products:nearby', `${latitude}:${longitude}:${radiusInMeters || 5000}`];

  if (brand) parts.push(`b:${brand}`);
  if (volume) parts.push(`v:${volume}`);
  if (minPrice) parts.push(`minp:${minPrice}`);
  if (maxPrice) parts.push(`maxp:${maxPrice}`);
  parts.push(`p:${page || 1}`);
  parts.push(`l:${limit || 20}`);

  return parts.join(':');
};
