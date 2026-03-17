import { Request, Response, NextFunction } from 'express';
import { DIContainer } from '@/infrastructure/di-container';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class VendorController {
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getCreateVendorUseCase();
      const result = await useCase.execute({
        ...req.body,
        userId: req.user!.userId,
      });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getGetVendorProfileUseCase();
      const result = await useCase.execute({
        vendorId: req.params.id,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getUpdateVendorUseCase();
      const result = await useCase.execute({
        ...req.body,
        vendorId: req.params.id,
        userId: req.user!.userId,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getMyProfile(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const vendorRepository = DIContainer.getVendorRepository();
      const vendor = await vendorRepository.findByUserId(req.user!.userId);

      if (!vendor) {
        res.status(404).json({ message: 'Vendor profile not found' });
        return;
      }

      res.status(200).json({
        id: vendor.id,
        userId: vendor.userId,
        companyName: vendor.companyName,
        cnpj: vendor.cnpj.getFormatted(),
        type: vendor.type,
        location: {
          latitude: vendor.location.getLatitude(),
          longitude: vendor.location.getLongitude(),
        },
        address: vendor.address,
        phone: vendor.phone,
        isVerified: vendor.isVerified,
        createdAt: vendor.createdAt,
        updatedAt: vendor.updatedAt,
      });
    } catch (error) {
      next(error);
    }
  }

  static async searchNearby(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getSearchNearbyVendorsUseCase();
      const radiusInMeters = req.query.radiusInMeters ? parseFloat(req.query.radiusInMeters as string) : 5000;
      
      const result = await useCase.execute({
        latitude: parseFloat(req.query.latitude as string),
        longitude: parseFloat(req.query.longitude as string),
        radiusInMeters,
        type: req.query.type as any,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async verify(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getVerifyVendorUseCase();
      const result = await useCase.execute({
        vendorId: req.params.id,
        adminUserId: req.user!.userId,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
