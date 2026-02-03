import { Request, Response, NextFunction } from 'express';
import { DIContainer } from '@/infrastructure/di-container';

export class AuthController {
  /**
   * POST /api/v1/auth/register
   * Registrar novo usuário
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getRegisterUserUseCase();
      const result = await useCase.execute(req.body);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/login
   * Autenticar usuário
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getAuthenticateUserUseCase();
      const result = await useCase.execute(req.body);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/refresh
   * Renovar access token
   */
  static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getRefreshTokenUseCase();
      const result = await useCase.execute(req.body);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/confirm-email
   * Confirmar email do usuário
   */
  static async confirmEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getConfirmEmailUseCase();
      const result = await useCase.execute(req.body);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/forgot-password
   * Solicitar reset de senha
   */
  static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getRequestPasswordResetUseCase();
      const result = await useCase.execute(req.body);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/reset-password
   * Resetar senha
   */
  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = DIContainer.getResetPasswordUseCase();
      const result = await useCase.execute(req.body);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
