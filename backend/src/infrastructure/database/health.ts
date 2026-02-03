import { prisma } from './prisma';

export async function checkDatabaseHealth(): Promise<{
  isHealthy: boolean;
  message: string;
  details?: Record<string, unknown>;
}> {
  try {
    // Test basic connection
    await prisma.$queryRaw`SELECT 1`;

    // Check PostGIS extension
    const postgisVersion = await prisma.$queryRaw<
      Array<{ version: string }>
    >`SELECT PostGIS_Version() as version`;

    // Get database stats
    const tableCount = await prisma.$queryRaw<
      Array<{ count: bigint }>
    >`SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'public'`;

    return {
      isHealthy: true,
      message: 'Database is healthy',
      details: {
        postgis: postgisVersion[0]?.version || 'unknown',
        tables: Number(tableCount[0]?.count || 0),
        connected: true,
      },
    };
  } catch (error) {
    return {
      isHealthy: false,
      message: error instanceof Error ? error.message : 'Database connection failed',
      details: {
        connected: false,
      },
    };
  }
}

export async function initializeDatabase(): Promise<void> {
  try {
    console.log('🔌 Connecting to database...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Enable PostGIS extension (if not already enabled)
    await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS postgis;');
    console.log('✅ PostGIS extension enabled');

    // Verify PostGIS
    const postgisVersion = await prisma.$queryRaw<
      Array<{ version: string }>
    >`SELECT PostGIS_Version() as version`;
    console.log(`✅ PostGIS version: ${postgisVersion[0]?.version || 'unknown'}`);

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}
