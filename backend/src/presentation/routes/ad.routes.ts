import { Router } from 'express';
import { AdController } from '../controllers/ad.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '@/domain/entities/user.entity';
import { cacheMiddleware, activeAdsCacheKey } from '../middlewares/cache.middleware';
import { CacheTTL } from '@/infrastructure/cache/cache.helpers';

const router = Router();

router.post('/', authenticate, authorize(UserRole.VENDOR), AdController.create);

router.get(
  '/active',
  cacheMiddleware({ ttl: CacheTTL.ADS_ACTIVE, keyGenerator: activeAdsCacheKey }),
  AdController.listActive
);

router.get('/my-ads', authenticate, authorize(UserRole.VENDOR), AdController.listMine);

router.post('/:id/cancel', authenticate, authorize(UserRole.VENDOR), AdController.cancel);

router.post('/expire', AdController.expire);

export default router;
