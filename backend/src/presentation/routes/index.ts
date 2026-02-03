import { Router } from 'express';
import authRoutes from './auth.routes';
import vendorRoutes from './vendor.routes';
import productRoutes from './product.routes';
import adRoutes from './ad.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/vendors', vendorRoutes);
router.use('/products', productRoutes);
router.use('/ads', adRoutes);

export default router;
