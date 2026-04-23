import request from 'supertest';
import app from '../src/app.js';

describe('API de productos', () => {
  it('GET /api/productos debe devolver un array de productos', async () => {
    const res = await request(app).get('/api/productos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('Registro y login de usuario', () => {
  const email = `test${Date.now()}@mail.com`;
  const password = '12345678';
  let token;

  it('POST /api/usuarios/register debe registrar un usuario', async () => {
    const res = await request(app)
      .post('/api/usuarios/register')
      .send({ nombre: 'Test', email, contrasena: password });
    expect(res.statusCode).toBe(201);
    expect(res.body.mensaje).toBeDefined();
  });

  it('POST /api/usuarios/login debe devolver un token', async () => {
    const res = await request(app)
      .post('/api/usuarios/login')
      .send({ email, contrasena: password });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it('GET /api/perfil debe requerir autenticación', async () => {
    const res = await request(app).get('/api/perfil');
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/perfil debe devolver datos del usuario autenticado', async () => {
    const res = await request(app)
      .get('/api/perfil')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.usuario).toBeDefined();
    expect(res.body.usuario.email).toBe(email);
  });
});
