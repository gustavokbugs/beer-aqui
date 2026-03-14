import { Request, Response, NextFunction } from 'express';
import { DIContainer } from '@/infrastructure/di-container';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class ProductController {
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const vendorRepository = DIContainer.getVendorRepository();
      const vendor = await vendorRepository.findByUserId(req.user!.userId);
      
      if (!vendor) {
        res.status(400).json({ 
          message: 'Vendor profile not found. Please complete your vendor profile first.' 
        });
        return;
      }

      const useCase = DIContainer.getCreateProductUseCase();
      const result = await useCase.execute({
        ...req.body,
        vendorId: vendor.id,
      });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getGetProductDetailsUseCase();
      const result = await useCase.execute({
        productId: req.params.id,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getUpdateProductUseCase();
      const result = await useCase.execute({
        ...req.body,
        productId: req.params.id,
        userId: req.user!.userId,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async updatePrice(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getUpdateProductPriceUseCase();
      const result = await useCase.execute({
        productId: req.params.id,
        userId: req.user!.userId,
        newPrice: req.body.price,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async toggleStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getToggleProductStatusUseCase();
      const result = await useCase.execute({
        productId: req.params.id,
        userId: req.user!.userId,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getDeleteProductUseCase();
      const result = await useCase.execute({
        productId: req.params.id,
        userId: req.user!.userId,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getSearchProductsUseCase();
      const result = await useCase.execute({
        brand: req.query.brand as string,
        volume: req.query.volume ? parseInt(req.query.volume as string) : undefined,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        vendorId: req.query.vendorId as string,
        state: req.query.state as string,
        city: req.query.city as string,
        neighborhood: req.query.neighborhood as string,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async searchNearby(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getSearchNearbyProductsUseCase();
      const result = await useCase.execute({
        latitude: parseFloat(req.query.latitude as string),
        longitude: parseFloat(req.query.longitude as string),
        radiusInMeters: req.query.radiusInMeters
          ? parseFloat(req.query.radiusInMeters as string)
          : 5000,
        brand: req.query.brand as string,
        volume: req.query.volume ? parseInt(req.query.volume as string) : undefined,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async listByVendor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getListVendorProductsUseCase();
      const result = await useCase.execute({
        vendorId: req.params.vendorId,
        includeInactive: req.query.includeInactive === 'true',
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async listMyProducts(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const vendorRepository = DIContainer.getVendorRepository();
      const vendor = await vendorRepository.findByUserId(req.user!.userId);
      
      if (!vendor) {
        res.status(200).json({
          products: [],
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0,
        });
        return;
      }

      const useCase = DIContainer.getListVendorProductsUseCase();
      const result = await useCase.execute({
        vendorId: vendor.id,
        includeInactive: req.query.includeInactive === 'true',
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async searchByBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getSearchProductsByBrandUseCase();
      const result = await useCase.execute({
        brand: req.params.brand,
        vendorId: req.query.vendorId as string,
        volumeMl: req.query.volume ? parseInt(req.query.volume as string) : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getBrandSuggestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getGetBrandSuggestionsUseCase();
      const result = await useCase.execute({
        query: req.query.q as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
