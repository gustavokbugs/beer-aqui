import { Request, Response, NextFunction } from 'express';
import { DIContainer } from '@/infrastructure/di-container';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class ProductController {
  /**
   * POST /api/v1/products
   * Criar novo produto
   */
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getCreateProductUseCase();
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
   * GET /api/v1/products/:id
   * Buscar detalhes do produto
   */
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

  /**
   * PUT /api/v1/products/:id
   * Atualizar produto
   */
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

  /**
   * PATCH /api/v1/products/:id/price
   * Atualizar preço do produto
   */
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

  /**
   * PATCH /api/v1/products/:id/status
   * Alternar status do produto
   */
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

  /**
   * DELETE /api/v1/products/:id
   * Deletar produto (soft delete)
   */
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

  /**
   * GET /api/v1/products/search
   * Buscar produtos com filtros
   */
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

  /**
   * GET /api/v1/vendors/:vendorId/products
   * Listar produtos de um vendedor
   */
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

  /**
   * GET /api/v1/products/brands/:brand
   * Buscar produtos por marca
   */
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

  /**
   * GET /api/v1/products/suggestions
   * Obter sugest\u00f5es de marcas para autocomplete
   */
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
