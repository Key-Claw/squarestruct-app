// Configuración principal de Express y conexión a la base de datos
import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Importación de rutas
import pedidosRouter from './routes/pedidos.js';
import perfilRouter from './routes/perfil.js';
import productosRouter from './routes/productos.js';
import usuariosRouter from './routes/usuarios.js';

// dotenv carga `backend/.env` y deja las variables disponibles en `process.env`.
// Este paso también sirve como respaldo si este archivo se importa desde otro contexto
// distinto a `server.js` (por ejemplo, tests o ejecuciones manuales).
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());

// Ruta protegida de ejemplo (perfil)
app.use('/api/perfil', perfilRouter);

// Ruta protegida de ejemplo (pedidos)
app.use('/api/pedidos', pedidosRouter);

// Depuración: mostrar valores de conexión para comprobar que dotenv cargó bien.
console.log('DB_USER:', process.env.DB_USER, 'DB_PASSWORD:', process.env.DB_PASSWORD);
// Conexión a la base de datos usando las variables que cargó dotenv.
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Comprueba que la conexión a MySQL funcione haciendo un ping a la BD
// Se llama en server.js al iniciar; si falla, el servidor sigue arrancando
// pero registra el error para que el desarrollador lo corrija (mejor para debug local)
export const checkDbConnection = async () => {
  const connection = await db.getConnection();
  await connection.ping();
  connection.release();
};

// Ruta base para validación rápida desde navegador
app.get('/', (req, res) => {
  res.status(200).send('Backend OK');
});

// Endpoint de prueba (health) para verificar que el servidor está disponible
app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

// Estado rápido de BD: útil para validar desde navegador que hay tablas y datos
app.get('/api/db-status', async (req, res) => {
  try {
    const [tables] = await db.query('SHOW TABLES');
    const [[usuarios]] = await db.query('SELECT COUNT(*) AS total FROM usuarios');
    const [[proveedores]] = await db.query('SELECT COUNT(*) AS total FROM proveedores');
    const [[productos]] = await db.query('SELECT COUNT(*) AS total FROM productos');
    const [[pedidos]] = await db.query('SELECT COUNT(*) AS total FROM pedidos');
    const [[pedidoDetalles]] = await db.query('SELECT COUNT(*) AS total FROM pedidoDetalles');

    res.status(200).json({
      ok: true,
      db: process.env.DB_NAME,
      tablas: tables.map((row) => Object.values(row)[0]),
      totales: {
        usuarios: usuarios.total,
        proveedores: proveedores.total,
        productos: productos.total,
        pedidos: pedidos.total,
        pedidoDetalles: pedidoDetalles.total
      }
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al consultar el estado de la base de datos',
      detalle: error.message
    });
  }
});

// Rutas de productos
app.use('/api/productos', productosRouter);

// Rutas de usuarios
app.use('/api/usuarios', usuariosRouter);

export default app;