import { Request, Response, NextFunction } from 'express';
import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  DomainError,
} from '@/domain/errors/domain-errors';
import { Prisma } from '@prisma/client';

export interface ErrorResponse {
  error: string;
  message: string;
  details?: any;
  stack?: string;
}

/**
 * Middleware de tratamento de erros global
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  // Erros de domínio
  if (error instanceof ValidationError) {
    res.status(400).json({
      error: 'Validation Error',
      message: error.message,
    });
    return;
  }

  if (error instanceof NotFoundError) {
    res.status(404).json({
      error: 'Not Found',
      message: error.message,
    });
    return;
  }

  if (error instanceof UnauthorizedError) {
    res.status(401).json({
      error: 'Unauthorized',
      message: error.message,
    });
    return;
  }

  if (error instanceof ConflictError) {
    res.status(409).json({
      error: 'Conflict',
      message: error.message,
    });
    return;
  }

  if (error instanceof DomainError) {
    res.status(400).json({
      error: error.name,
      message: error.message,
    });
    return;
  }

  // Erros do Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // Unique constraint violation
      res.status(409).json({
        error: 'Conflict',
        message: 'A record with this value already exists',
        details: error.meta,
      });
      return;
    }

    if (error.code === 'P2025') {
      // Record not found
      res.status(404).json({
        error: 'Not Found',
        message: 'Record not found',
      });
      return;
    }

    res.status(400).json({
      error: 'Database Error',
      message: error.message,
      code: error.code,
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid data provided',
    });
    return;
  }

  // Erro genérico
  const response: ErrorResponse = {
    error: 'Internal Server Error',
    message: error.message || 'An unexpected error occurred',
  };

  // Incluir stack trace apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  res.status(500).json(response);
};

/**
 * Middleware para capturar rotas não encontradas
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
};
