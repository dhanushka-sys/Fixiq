import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('Health Check API Endpoint', () => {
  const app = createApp();

  it('GET /api/health should return 200 OK with service status', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('service', 'fixiq-api');
    expect(response.body).toHaveProperty('timestamp');
    expect(typeof response.body.uptimeSeconds).toBe('number');
  });
});
