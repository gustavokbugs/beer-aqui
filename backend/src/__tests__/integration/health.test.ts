import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../app';

describe('Health Check Endpoints', () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'BeerAqui API');
      expect(response.body).toHaveProperty('status', 'running');
      expect(response.body).toHaveProperty('version');
    });
  });

  describe('GET /health', () => {
    it('should return 200 and healthy status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('database');
    });

    it('should include database health information', async () => {
      const response = await request(app).get('/health');

      expect(response.body.database).toHaveProperty('isHealthy');
    });
  });

  describe('GET /health/db', () => {
    it('should return database health status', async () => {
      const response = await request(app).get('/health/db');

      expect([200, 503]).toContain(response.status);
      expect(response.body).toHaveProperty('isHealthy');
    });
  });

  describe('GET /invalid-route', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/invalid-route');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });
});

