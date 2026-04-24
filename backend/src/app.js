// Configuración principal de Express y conexión a la base de datos
import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Importación de rutas
import perfilRouter from './routes/perfil.js';
import productosRouter from './routes/productos.js';
import usuariosRouter from './routes/usuarios.js';

// Cargar variables de entorno desde backend/.env aunque el proceso se arranque desde otro directorio.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());

// Ruta protegida de ejemplo (perfil)
app.use('/api/perfil', perfilRouter);

// Conexión a la base de datos
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

// Endpoint de prueba (health) para verificar que el servidor está disponible
app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

// Rutas de productos
app.use('/api/productos', productosRouter);

// Rutas de usuarios
app.use('/api/usuarios', usuariosRouter);

export default app;