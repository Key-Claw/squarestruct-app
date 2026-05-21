import request from 'supertest';
import app, { db } from '../../src/app.js';

describe('Health check', () => {
  afterAll(async () => {
    await db.end();
  });

  it('GET /api/health debe devolver OK', async () => {
    const res = await request(app).get('/api/health');

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('OK');
  });
});
