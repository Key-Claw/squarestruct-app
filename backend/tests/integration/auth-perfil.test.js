import request from 'supertest';
import app, { db } from '../../src/app.js';

describe('Registro y login de usuario', () => {
  const email = `test${Date.now()}@mail.com`;
  const password = 'Hola123!';
  const adminEmail = `admin-auth${Date.now()}@mail.com`;
  const adminPassword = 'Hola123!';
  let token;
  let adminToken;

  afterAll(async () => {
    await db.end();
  });

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

  it('prepara un token de administrador para validar permisos', async () => {
    await db.query(
      `INSERT INTO usuarios (nombre, primerApellido, email, contrasena, rol)
       VALUES (?, ?, ?, ?, ?)`,
      [
        'Admin Auth',
        'Test',
        adminEmail,
        '$2b$10$VSCt51JCe5d2kYdchOmB.uTTROriNQkZAlBxqTJMtNjA5F.QwjMPm',
        'admin'
      ]
    );

    const res = await request(app)
      .post('/api/usuarios/login')
      .send({ email: adminEmail, contrasena: adminPassword });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    adminToken = res.body.token;
  });

  it('GET /api/usuarios debe rechazar usuarios sin rol admin', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe('Acceso solo para administradores');
  });

  it('GET /api/usuarios debe permitir al administrador ver la lista', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/usuarios/:id debe devolver el detalle de un usuario', async () => {
    const res = await request(app)
      .get('/api/usuarios/1')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.idUsuario).toBeDefined();
    expect(res.body.email).toBeDefined();
    expect(res.body.rol).toBeDefined();
  });
});
