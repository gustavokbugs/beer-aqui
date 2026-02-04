import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '@/domain/entities/user.entity';
import {
  cacheMiddleware,
  productSearchCacheKey,
  vendorProductsCacheKey,
} from '../middlewares/cache.middleware';
import { CacheTTL } from '@/infrastructure/cache/cache.helpers';

const router = Router();

/**
 * @route   POST /api/v1/products
 * @desc    Create new product
 * @access  Private (VENDOR role)
 */
router.post('/', authenticate, authorize(UserRole.VENDOR), ProductController.create);

/**
 * @route   GET /api/v1/products/suggestions
 * @desc    Get brand suggestions for autocomplete
 * @access  Public
 */
router.get('/suggestions', ProductController.getBrandSuggestions);

/**
 * @route   GET /api/v1/products/search
 * @desc    Search products (cached)
 * @access  Public
 */
router.get(
  '/search',
  cacheMiddleware({ ttl: CacheTTL.PRODUCTS_SEARCH, keyGenerator: productSearchCacheKey }),
  ProductController.search
);

/**
 * @route   GET /api/v1/products/brands/:brand
 * @desc    Search products by brand (cached)
 * @access  Public
 */
router.get(
  '/brands/:brand',
  cacheMiddleware({ ttl: CacheTTL.PRODUCTS_SEARCH }),
  ProductController.searchByBrand
);

/**
 * @route   GET /api/v1/products/:id
 * @desc    Get product details (cached)
 * @access  Public
 */
router.get(
  '/:id',
  cacheMiddleware({ ttl: CacheTTL.PRODUCT_DETAILS }),
  ProductController.getDetails
);

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Update product
 * @access  Private (VENDOR role, own product)
 */
router.put('/:id', authenticate, authorize(UserRole.VENDOR), ProductController.update);

/**
 * @route   PATCH /api/v1/products/:id/price
 * @desc    Update product price
 * @access  Private (VENDOR role, own product)
 */
router.patch('/:id/price', authenticate, authorize(UserRole.VENDOR), ProductController.updatePrice);

/**
 * @route   PATCH /api/v1/products/:id/status
 * @desc    Toggle product status
 * @access  Private (VENDOR role, own product)
 */
router.patch('/:id/status', authenticate, authorize(UserRole.VENDOR), ProductController.toggleStatus);

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Delete product (soft delete)
 * @access  Private (VENDOR role, own product)
 */
router.delete('/:id', authenticate, authorize(UserRole.VENDOR), ProductController.delete);

/**
 * @route   GET /api/v1/vendors/:vendorId/products
 * @desc    List vendor products
 * @access  Public
 */
router.get('/vendors/:vendorId/products', ProductController.listByVendor);

export default router;
