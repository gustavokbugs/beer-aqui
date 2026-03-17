import { Request, Response, NextFunction } from 'express';
import { DIContainer } from '@/infrastructure/di-container';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class AdController {
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getCreateAdUseCase();
      const result = await useCase.execute({
        productId: req.body.productId,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        priority: Number(req.body.priority),
        userId: req.user!.userId,
      });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async listActive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getListActiveAdsUseCase();
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const result = await useCase.execute(page, limit);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async listMine(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getListVendorAdsUseCase();
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const result = await useCase.execute({
        userId: req.user!.userId,
        page,
        limit,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

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
