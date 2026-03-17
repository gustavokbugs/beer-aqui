import { Router } from 'express';
import { VendorController } from '../controllers/vendor.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { UserRole } from '@/domain/entities/user.entity';
import { cacheMiddleware, nearbyVendorsCacheKey } from '../middlewares/cache.middleware';
import { CacheTTL } from '@/infrastructure/cache/cache.helpers';
import { createVendorSchema, updateVendorSchema } from '../schemas/vendor.schemas';

const router = Router();

router.post('/', authenticate, authorize(UserRole.VENDOR), validate(createVendorSchema), VendorController.create);

router.get(
  '/nearby',
  cacheMiddleware({ ttl: CacheTTL.VENDORS_NEARBY, keyGenerator: nearbyVendorsCacheKey }),
  VendorController.searchNearby
);

router.get('/me', authenticate, authorize(UserRole.VENDOR), VendorController.getMyProfile);

router.get(
  '/:id',
  cacheMiddleware({ ttl: CacheTTL.VENDOR_PROFILE }),
  VendorController.getProfile
);

router.put('/:id', authenticate, authorize(UserRole.VENDOR), validate(updateVendorSchema), VendorController.update);

router.post('/:id/verify', authenticate, authorize(UserRole.ADMIN), VendorController.verify);

export default router;
