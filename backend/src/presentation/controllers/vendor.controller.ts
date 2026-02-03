import { Request, Response, NextFunction } from 'express';
import { DIContainer } from '@/infrastructure/di-container';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class VendorController {
  /**
   * POST /api/v1/vendors
   * Criar novo vendedor
   */
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

  /**
   * GET /api/v1/vendors/:id
   * Buscar perfil de vendedor
   */
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

  /**
   * PUT /api/v1/vendors/:id
   * Atualizar vendedor
   */
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

  /**
   * GET /api/v1/vendors/nearby
   * Buscar vendedores próximos
   */
  static async searchNearby(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getSearchNearbyVendorsUseCase();
      const result = await useCase.execute({
        latitude: parseFloat(req.query.latitude as string),
        longitude: parseFloat(req.query.longitude as string),
        radiusKm: req.query.radiusKm ? parseFloat(req.query.radiusKm as string) : undefined,
        type: req.query.type as any,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/vendors/:id/verify
   * Verificar vendedor (admin only)
   */
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
