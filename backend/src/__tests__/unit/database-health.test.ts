import { checkDatabaseHealth } from '../../infrastructure/database/health';

describe('Database Health', () => {
  it('should check database health successfully', async () => {
    const health = await checkDatabaseHealth();

    expect(health).toHaveProperty('isHealthy');
    expect(health).toHaveProperty('message');
    expect(typeof health.isHealthy).toBe('boolean');
    expect(typeof health.message).toBe('string');
  });

  it('should return healthy status when connected', async () => {
    const health = await checkDatabaseHealth();

    expect(health.isHealthy).toBe(true);
    expect(health.message).toBe('Database is healthy');
  });

  it('should include database details when healthy', async () => {
    const health = await checkDatabaseHealth();

    if (health.isHealthy) {
      expect(health.details).toBeDefined();
    }
  });
});
