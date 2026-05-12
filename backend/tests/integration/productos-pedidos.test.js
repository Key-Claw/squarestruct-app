import request from 'supertest';
import app, { db } from '../../src/app.js';

describe('Productos y pedidos', () => {
  const email = `pedido${Date.now()}@mail.com`;
  const password = '12345678';
  let token;
  let idProducto;

  afterAll(async () => {
    await db.end();
  });

  it('GET /api/productos debe devolver productos del catalogo', async () => {
    const res = await request(app).get('/api/productos');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].idProducto).toBeDefined();
    expect(res.body[0].nombre).toBeDefined();

    idProducto = res.body[0].idProducto;
  });

  it('prepara un usuario autenticado para probar pedidos', async () => {
    const registerRes = await request(app)
      .post('/api/usuarios/register')
      .send({
        nombre: 'Pedido',
        primerApellido: 'Test',
        email,
        contrasena: password
      });

    expect(registerRes.statusCode).toBe(201);

    const loginRes = await request(app)
      .post('/api/usuarios/login')
      .send({ email, contrasena: password });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.token).toBeDefined();
    token = loginRes.body.token;
  });

  it('GET /api/pedidos debe rechazar peticiones sin token', async () => {
    const res = await request(app).get('/api/pedidos');

    expect(res.statusCode).toBe(401);
  });

  it('GET /api/pedidos debe permitir peticiones con token', async () => {
    const res = await request(app)
      .get('/api/pedidos')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/pedidos debe crear un pedido con token', async () => {
    const res = await request(app)
      .post('/api/pedidos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        direccionEnvio: 'Calle Test 123, Madrid',
        metodoPago: 'tarjeta',
        productos: [
          {
            idProducto,
            cantidad: 1
          }
        ]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.mensaje).toBe('Pedido creado correctamente');
    expect(res.body.idPedido).toBeDefined();
    expect(Number(res.body.total)).toBeGreaterThan(0);
  });
});
