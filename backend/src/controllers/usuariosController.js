// Controlador para usuarios

import { db } from '../app.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUsuario = async (req, res) => {
  const { nombre, email, contrasena } = req.body;
  if (!nombre || !email || !contrasena) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  try {
    // Verificar si el usuario ya existe
    const [existe] = await db.query('SELECT idUsuario FROM usuarios WHERE email = ?', [email]);
    if (existe.length > 0) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }
    // Hashear la contraseña
    const hash = await bcrypt.hash(contrasena, 10);
    // Insertar usuario
    await db.query(
      'INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)',
      [nombre, email, hash]
    );
    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};


export const loginUsuario = async (req, res) => {
  const { email, contrasena } = req.body;
  if (!email || !contrasena) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  try {
    const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (usuarios.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const usuario = usuarios[0];
    const match = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!match) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    // Generar JWT
    const token = jwt.sign(
      { idUsuario: usuario.idUsuario, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '2h' }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
