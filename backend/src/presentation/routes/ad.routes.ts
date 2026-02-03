import { Router } from 'express';
import { AdController } from '../controllers/ad.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '@/domain/entities/user.entity';
import { cacheMiddleware, activeAdsCacheKey } from '../middlewares/cache.middleware';
import { CacheTTL } from '@/infrastructure/cache/cache.helpers';

const router = Router();

/**
 * @route   POST /api/v1/ads
 * @desc    Create new ad
 * @access  Private (VENDOR role)
 */
router.post('/', authenticate, authorize(UserRole.VENDOR), AdController.create);

/**
 * @route   GET /api/v1/ads/active
 * @desc    List active ads (cached)
 * @access  Public
 */
router.get(
  '/active',
  cacheMiddleware({ ttl: CacheTTL.ADS_ACTIVE, keyGenerator: activeAdsCacheKey }),
  AdController.listActive
);

/**
 * @route   POST /api/v1/ads/:id/cancel
 * @desc    Cancel ad
 * @access  Private (VENDOR role, own ad)
 */
router.post('/:id/cancel', authenticate, authorize(UserRole.VENDOR), AdController.cancel);

/**
 * @route   POST /api/v1/ads/expire
 * @desc    Expire ads (cron job)
 * @access  Public (should be protected by IP or API key in production)
 */
router.post('/expire', AdController.expire);

export default router;
