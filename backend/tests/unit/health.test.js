import request from 'supertest';
import app from '../../src/app.js';

describe('Health check', () => {
  it('GET /api/health debe devolver OK', async () => {
    const res = await request(app).get('/api/health');

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('OK');
  });
});
