import { Router } from 'express';
import { AdController } from '../controllers/ad.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '@/domain/entities/user.entity';

const router = Router();

/**
 * @route   POST /api/v1/ads
 * @desc    Create new ad
 * @access  Private (VENDOR role)
 */
router.post('/', authenticate, authorize(UserRole.VENDOR), AdController.create);

/**
 * @route   GET /api/v1/ads/active
 * @desc    List active ads
 * @access  Public
 */
router.get('/active', AdController.listActive);

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
