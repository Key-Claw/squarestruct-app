import request from 'supertest';
import app, { db } from '../../src/app.js';

describe('Productos y pedidos', () => {
  const email = `pedido${Date.now()}@mail.com`;
  const otherEmail = `pedido-otro${Date.now()}@mail.com`;
  const adminEmail = `admin-productos${Date.now()}@mail.com`;
  const password = '12345678';
  let token;
  let otherToken;
  let adminToken;
  let idProducto;
  let idPedido;

  beforeAll(async () => {
    try {
      await db.query('ALTER TABLE pedidos ADD COLUMN fechaCancelacion DATETIME NULL AFTER estado');
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        throw error;
      }
    }
  });

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

  it('prepara un admin autenticado para gestionar productos', async () => {
    await db.query(
      `INSERT INTO usuarios (nombre, primerApellido, email, contrasena, rol)
       VALUES (?, ?, ?, ?, ?)`,
      [
        'Admin Productos',
        'Test',
        adminEmail,
        '$2b$10$uDPwExnvB1b.4fDtKNOKZOx.4BmAODWoLc23EtZZOa6IPljXf3cjW',
        'admin'
      ]
    );

    const res = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: adminEmail,
        contrasena: '123456'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    adminToken = res.body.token;
  });

  it('POST /api/productos debe rechazar creacion sin token', async () => {
    const res = await request(app)
      .post('/api/productos')
      .send({
        nombre: 'TEST Bloque EcoBase',
        descripcion: 'Bloque creado desde test de integracion.',
        precio: 42.5,
        tipo: 'bloque',
        material: 'Plastico reciclable',
        alto: 22.7,
        ancho: 19.7,
        largo: 39.4,
        idProveedor: 1
      });

    expect(res.statusCode).toBe(401);
  });

  it('POST /api/productos debe permitir creacion con token admin', async () => {
    const res = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'TEST Bloque EcoBase',
        descripcion: 'Bloque creado desde test de integracion.',
        precio: 42.5,
        tipo: 'bloque',
        material: 'Plastico reciclable',
        alto: 22.7,
        ancho: 19.7,
        largo: 39.4,
        idProveedor: 1
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.idProducto).toBeDefined();
    idProducto = res.body.idProducto;
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

    const otherRegisterRes = await request(app)
      .post('/api/usuarios/register')
      .send({
        nombre: 'Otro',
        primerApellido: 'Pedido',
        email: otherEmail,
        contrasena: password
      });

    expect(otherRegisterRes.statusCode).toBe(201);

    const otherLoginRes = await request(app)
      .post('/api/usuarios/login')
      .send({ email: otherEmail, contrasena: password });

    expect(otherLoginRes.statusCode).toBe(200);
    expect(otherLoginRes.body.token).toBeDefined();
    otherToken = otherLoginRes.body.token;
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

    idPedido = res.body.idPedido;
  });

  it('GET /api/pedidos/:id debe devolver un pedido concreto con token', async () => {
    const res = await request(app)
      .get(`/api/pedidos/${idPedido}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.idPedido).toBe(idPedido);
    expect(Array.isArray(res.body.productos)).toBe(true);
  });

  it('PATCH /api/pedidos/:id/cancelar debe cancelar un pedido con token', async () => {
    const res = await request(app)
      .patch(`/api/pedidos/${idPedido}/cancelar`)
      .set('Authorization', `Bearer ${token}`)
      .send({ motivo: 'Cancelado desde test de integracion' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Pedido cancelado correctamente');
    expect(res.body.pedido).toEqual({
      idPedido,
      estado: 'cancelado'
    });
  });

  it('PATCH /api/pedidos/:id/cancelar debe impedir cancelar dos veces', async () => {
    const res = await request(app)
      .patch(`/api/pedidos/${idPedido}/cancelar`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(409);
    expect(res.body.error).toBe('El pedido ya esta cancelado');
  });

  it('PATCH /api/pedidos/:id/cancelar debe impedir cancelar pedidos enviados', async () => {
    const pedidoRes = await request(app)
      .post('/api/pedidos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        direccionEnvio: 'Calle Envio 123, Madrid',
        metodoPago: 'tarjeta',
        productos: [
          {
            idProducto,
            cantidad: 1
          }
        ]
      });

    await db.query('UPDATE pedidos SET estado = ? WHERE idPedido = ?', ['enviado', pedidoRes.body.idPedido]);

    const res = await request(app)
      .patch(`/api/pedidos/${pedidoRes.body.idPedido}/cancelar`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(409);
    expect(res.body.error).toBe('No se puede cancelar un pedido completado o enviado');
  });

  it('PATCH /api/pedidos/:id/cancelar debe rechazar usuarios que no son propietarios', async () => {
    const pedidoRes = await request(app)
      .post('/api/pedidos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        direccionEnvio: 'Calle Propietario 123, Madrid',
        metodoPago: 'tarjeta',
        productos: [
          {
            idProducto,
            cantidad: 1
          }
        ]
      });

    const res = await request(app)
      .patch(`/api/pedidos/${pedidoRes.body.idPedido}/cancelar`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe('No puedes cancelar este pedido');
  });

  it('PATCH /api/pedidos/:id/cancelar debe permitir cancelar a un admin', async () => {
    const pedidoRes = await request(app)
      .post('/api/pedidos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        direccionEnvio: 'Calle Admin 123, Madrid',
        metodoPago: 'tarjeta',
        productos: [
          {
            idProducto,
            cantidad: 1
          }
        ]
      });

    const res = await request(app)
      .patch(`/api/pedidos/${pedidoRes.body.idPedido}/cancelar`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.pedido).toEqual({
      idPedido: pedidoRes.body.idPedido,
      estado: 'cancelado'
    });
  });
});
