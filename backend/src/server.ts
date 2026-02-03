import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { initializeDatabase, checkDatabaseHealth } from './infrastructure/database/health';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN.split(','), credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', async (_req, res) => {
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

app.get('/', (_req, res) => {
  res.json({ name: 'BeerAqui API', version: env.API_VERSION, status: 'running' });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'The requested resource was not found' });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

const PORT = parseInt(env.PORT, 10);

async function startServer(): Promise<void> {
  try {
    await initializeDatabase();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${env.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
