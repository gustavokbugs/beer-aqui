import { Request, Response, NextFunction } from 'express';
import { DIContainer } from '@/infrastructure/di-container';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class AdController {
  /**
   * POST /api/v1/ads
   * Criar novo anúncio
   */
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getCreateAdUseCase();
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
   * GET /api/v1/ads/active
   * Listar anúncios ativos
   */
  static async listActive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getListActiveAdsUseCase();
      const result = await useCase.execute({
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/ads/:id/cancel
   * Cancelar anúncio
   */
  static async cancel(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getCancelAdUseCase();
      const result = await useCase.execute({
        adId: req.params.id,
        userId: req.user!.userId,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/ads/expire
   * Expirar anúncios (cron job - sem auth)
   */
  static async expire(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getExpireAdsUseCase();
      const result = await useCase.execute();

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
