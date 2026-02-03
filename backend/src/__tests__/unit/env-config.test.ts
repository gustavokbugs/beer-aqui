import { env } from '../../config/env';

describe('Environment Configuration', () => {
  it('should load environment variables correctly', () => {
    expect(env).toBeDefined();
    expect(env.NODE_ENV).toBe('test');
    expect(env.DATABASE_URL).toContain('beeraqui_test');
  });

  it('should have required configuration fields', () => {
    expect(env).toHaveProperty('PORT');
    expect(env).toHaveProperty('DATABASE_URL');
    expect(env).toHaveProperty('JWT_SECRET');
    expect(env).toHaveProperty('CORS_ORIGIN');
    expect(env).toHaveProperty('API_VERSION');
  });

  it('should have valid port number', () => {
    const port = parseInt(env.PORT, 10);
    expect(port).toBeGreaterThan(0);
    expect(port).toBeLessThan(65536);
  });

  it('should have JWT secret with minimum length', () => {
    expect(env.JWT_SECRET.length).toBeGreaterThanOrEqual(32);
  });
});
