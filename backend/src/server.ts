import 'express-async-errors';
import { env } from './config/env';
import { initializeDatabase } from './infrastructure/database/health';
import { createApp } from './app';

const PORT = parseInt(env.PORT, 10);

async function startServer(): Promise<void> {
  try {
    await initializeDatabase();
    
    const app = createApp();
    
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

