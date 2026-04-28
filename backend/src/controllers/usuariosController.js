// Controlador para usuarios

import { db } from '../app.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


// TODO: revisar error en registro de usuarios
// Actualmente POST /api/usuarios/register devuelve 500 en tests de integración
// Esto impide completar correctamente el flujo login → perfil
// Posibles causas: validación, inserción en BD o hash de contraseña
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
    res.status(500).json({ error: 'Error al registrar usuario', detalle: error.message });
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
    res.status(500).json({ error: 'Error al iniciar sesión', detalle: error.message });
  }
};


export const getUsuarios = async (req, res) => {
  try {
    const [usuarios] = await db.query(
      'SELECT idUsuario, nombre, email, rol, creadoEn FROM usuarios'
    );

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};


export const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;

    const [usuarios] = await db.query(
      'SELECT idUsuario, nombre, email, rol, creadoEn FROM usuarios WHERE idUsuario = ?',
      [id]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuarios[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};


export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, rol } = req.body;

    if (!nombre || !email || !rol) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const [result] = await db.query(
      `UPDATE usuarios
       SET nombre = ?, email = ?, rol = ?
       WHERE idUsuario = ?`,
      [nombre, email, rol, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario actualizado correctamente' });
  } catch (error) {
    res.status(500).json({
      error: 'Error al actualizar usuario',
      detalle: error.message
    });
  }
};


export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM usuarios WHERE idUsuario = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(409).json({
      error: 'No se puede eliminar el usuario porque tiene pedidos asociados',
      detalle: error.message
    });
  }
};
