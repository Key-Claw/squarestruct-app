// Configuración principal de Express y conexión a la base de datos
import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Importación de rutas
import perfilRouter from './routes/perfil.js';
import productosRouter from './routes/productos.js';
import usuariosRouter from './routes/usuarios.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
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

// Endpoint de prueba (health)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Rutas de productos
app.use('/api/productos', productosRouter);

// Rutas de usuarios
app.use('/api/usuarios', usuariosRouter);

export default app;