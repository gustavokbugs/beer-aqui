import { Request, Response, NextFunction } from 'express';
import { RedisCacheService } from '@/infrastructure/cache/redis.service';

export interface CacheOptions {
  ttl: number; // Time to live in seconds
  keyGenerator?: (req: Request) => string;
}

/**
 * Middleware de cache HTTP
 * Armazena respostas no Redis
 */
export const cacheMiddleware = (options: CacheOptions) => {
  const cacheService = RedisCacheService.getInstance();

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Apenas cacheia GET requests
    if (req.method !== 'GET') {
      next();
      return;
    }

    try {
      // Gera chave do cache
      const cacheKey = options.keyGenerator
        ? options.keyGenerator(req)
        : `http:${req.method}:${req.originalUrl}`;

      // Busca no cache
      const cachedData = await cacheService.get<any>(cacheKey);

      if (cachedData) {
        // Cache hit - retorna dados do cache
        res.set('X-Cache', 'HIT');
        res.status(200).json(cachedData);
        return;
      }

      // Cache miss - intercepta response
      const originalJson = res.json.bind(res);

      res.json = function (data: any): Response {
        // Armazena no cache apenas se status for 200
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
      // Em caso de erro, continua sem cache
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

/**
 * Cria gerador de chave de cache para busca de vendedores próximos
 */
export const nearbyVendorsCacheKey = (req: Request): string => {
  const { latitude, longitude, radiusKm, type } = req.query;
  return `vendors:nearby:${latitude}:${longitude}:${radiusKm || 5}${type ? `:${type}` : ''}`;
};

/**
 * Cria gerador de chave de cache para busca de produtos
 */
export const productSearchCacheKey = (req: Request): string => {
  const { brand, volumeMl, minPrice, maxPrice, vendorId, page, limit } = req.query;
  const parts: string[] = ['products:search'];
  
  if (brand) parts.push(`b:${brand}`);
  if (volumeMl) parts.push(`v:${volumeMl}`);
  if (minPrice) parts.push(`minp:${minPrice}`);
  if (maxPrice) parts.push(`maxp:${maxPrice}`);
  if (vendorId) parts.push(`vid:${vendorId}`);
  parts.push(`p:${page || 1}`);
  parts.push(`l:${limit || 20}`);
  
  return parts.join(':');
};

/**
 * Cria gerador de chave de cache para produtos de um vendedor
 */
export const vendorProductsCacheKey = (req: Request): string => {
  const { vendorId } = req.params;
  const { page, limit, includeInactive } = req.query;
  return `products:vendor:${vendorId}:${page || 1}:${limit || 20}${includeInactive ? ':inactive' : ''}`;
};

/**
 * Cria gerador de chave de cache para anúncios ativos
 */
export const activeAdsCacheKey = (req: Request): string => {
  const { page, limit } = req.query;
  return `ads:active:${page || 1}:${limit || 20}`;
};
