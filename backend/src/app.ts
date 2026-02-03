import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './presentation/routes';
import { errorHandler, notFoundHandler } from './presentation/middlewares/error.middleware';
import { DIContainer } from './infrastructure/di-container';

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.errorHandling();
  }

  private middlewares(): void {
    // Security
    this.app.use(helmet());

    // CORS
    const corsOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:19006'];
    this.app.use(
      cors({
        origin: corsOrigins,
        credentials: true,
      })
    );

    // Body parser
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Logging
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    // Request ID
    this.app.use((req, res, next) => {
      req.headers['x-request-id'] = req.headers['x-request-id'] || crypto.randomUUID();
      next();
    });
  }

  private routes(): void {
    // API routes
    const apiVersion = process.env.API_VERSION || 'v1';
    this.app.use(`/api/${apiVersion}`, routes);

    // Root route
    this.app.get('/', (req, res) => {
      res.json({
        name: 'BeerAqui API',
        version: apiVersion,
        status: 'running',
        timestamp: new Date().toISOString(),
      });
    });
  }

  private errorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Error handler
    this.app.use(errorHandler);
  }

  public async start(port: number): Promise<void> {
    // Initialize database and dependencies
    await DIContainer.initialize();

    // Start server
    this.app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📚 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 API: http://localhost:${port}/api/${process.env.API_VERSION || 'v1'}`);
    });
  }

  public async stop(): Promise<void> {
    await DIContainer.shutdown();
    console.log('👋 Server stopped gracefully');
  }
}

