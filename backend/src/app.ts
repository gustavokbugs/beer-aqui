import express, { Express, Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import './config/i18n'; // Inicializa i18n
import { checkDatabaseHealth } from './infrastructure/database/health';
import { localeMiddleware } from './infrastructure/http/middlewares/locale.middleware';

export function createApp(): Express {
  const app = express();

  // Middlewares
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN.split(','), credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(localeMiddleware); // Detecta idioma do usuário

  // Root endpoint
  app.get('/', (_req: Request, res: Response) => {
    res.json({ 
      name: 'BeerAqui API', 
      version: env.API_VERSION, 
      status: 'running' 
    });
  });

  // Health check endpoints
  app.get('/health', async (_req: Request, res: Response) => {
    const dbHealth = await checkDatabaseHealth();
    const isHealthy = dbHealth.isHealthy;
    const statusCode = isHealthy ? 200 : 503;
    res.status(statusCode).json({
      status: isHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      database: dbHealth,
    });
  });

  app.get('/health/db', async (_req: Request, res: Response) => {
    const dbHealth = await checkDatabaseHealth();
    res.status(dbHealth.isHealthy ? 200 : 503).json(dbHealth);
  });

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not Found',
      message: 'The requested resource was not found',
    });
  });

  // Error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    });
  });

  return app;
}

