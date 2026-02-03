import { Router } from 'express';
import { VendorController } from '../controllers/vendor.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '@/domain/entities/user.entity';

const router = Router();

/**
 * @route   POST /api/v1/vendors
 * @desc    Create new vendor
 * @access  Private (VENDOR role)
 */
router.post('/', authenticate, authorize(UserRole.VENDOR), VendorController.create);

/**
 * @route   GET /api/v1/vendors/nearby
 * @desc    Search nearby vendors
 * @access  Public
 */
router.get('/nearby', VendorController.searchNearby);

/**
 * @route   GET /api/v1/vendors/:id
 * @desc    Get vendor profile
 * @access  Public
 */
router.get('/:id', VendorController.getProfile);

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
