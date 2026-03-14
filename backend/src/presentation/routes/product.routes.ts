import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '@/domain/entities/user.entity';
import {
  cacheMiddleware,
  nearbyProductsCacheKey,
  productSearchCacheKey,
} from '../middlewares/cache.middleware';
import { CacheTTL } from '@/infrastructure/cache/cache.helpers';

const router = Router();

router.post('/', authenticate, authorize(UserRole.VENDOR), ProductController.create);

router.get('/suggestions', ProductController.getBrandSuggestions);

router.get('/my-products', authenticate, authorize(UserRole.VENDOR), ProductController.listMyProducts);

router.get(
  '/search',
  cacheMiddleware({ ttl: CacheTTL.PRODUCTS_SEARCH, keyGenerator: productSearchCacheKey }),
  ProductController.search
);

router.get(
  '/nearby',
  cacheMiddleware({ ttl: CacheTTL.PRODUCTS_SEARCH, keyGenerator: nearbyProductsCacheKey }),
  ProductController.searchNearby
);

router.get(
  '/brands/:brand',
  cacheMiddleware({ ttl: CacheTTL.PRODUCTS_SEARCH }),
  ProductController.searchByBrand
);

router.get(
  '/:id',
  cacheMiddleware({ ttl: CacheTTL.PRODUCT_DETAILS }),
  ProductController.getDetails
);

router.put('/:id', authenticate, authorize(UserRole.VENDOR), ProductController.update);

router.patch('/:id/price', authenticate, authorize(UserRole.VENDOR), ProductController.updatePrice);

router.patch('/:id/status', authenticate, authorize(UserRole.VENDOR), ProductController.toggleStatus);

router.delete('/:id', authenticate, authorize(UserRole.VENDOR), ProductController.delete);

router.get('/vendors/:vendorId/products', ProductController.listByVendor);

export default router;
