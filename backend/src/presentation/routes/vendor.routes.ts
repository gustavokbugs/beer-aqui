import { Router } from 'express';
import { VendorController } from '../controllers/vendor.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '@/domain/entities/user.entity';
import { cacheMiddleware, nearbyVendorsCacheKey } from '../middlewares/cache.middleware';
import { CacheTTL } from '@/infrastructure/cache/cache.helpers';

const router = Router();

/**
 * @route   POST /api/v1/vendors
 * @desc    Create new vendor
 * @access  Private (VENDOR role)
 */
router.post('/', authenticate, authorize(UserRole.VENDOR), VendorController.create);

/**
 * @route   GET /api/v1/vendors/nearby
 * @desc    Search nearby vendors (cached)
 * @access  Public
 */
router.get(
  '/nearby',
  cacheMiddleware({ ttl: CacheTTL.VENDORS_NEARBY, keyGenerator: nearbyVendorsCacheKey }),
  VendorController.searchNearby
);

/**
 * @route   GET /api/v1/vendors/:id
 * @desc    Get vendor profile (cached)
 * @access  Public
 */
router.get(
  '/:id',
  cacheMiddleware({ ttl: CacheTTL.VENDOR_PROFILE }),
  VendorController.getProfile
);

/**
 * @route   PUT /api/v1/vendors/:id
 * @desc    Update vendor
 * @access  Private (Own vendor only)
 */
router.put('/:id', authenticate, authorize(UserRole.VENDOR), VendorController.update);

/**
 * @route   POST /api/v1/vendors/:id/verify
 * @desc    Verify vendor
 * @access  Private (ADMIN only)
 */
router.post('/:id/verify', authenticate, authorize(UserRole.ADMIN), VendorController.verify);

export default router;
