// Controlador para usuarios

import { db } from '../app.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SUPER_ADMIN_EMAIL = 'admin@squarestruct.com';

/**
 * Corrige texto con mojibake típico de una mala decodificación UTF-8/latin1 (Para las tildes y eso).
 * Se usa para normalizar nombres y datos de usuario ya guardados en la base.
 * @param {string} value - Texto a corregir.
 * @returns {string} Texto corregido o el original si no parece afectado.
 */
const normalizarTexto = (value) => {
  if (typeof value !== 'string' || !/[ÃÂ�]/.test(value)) {
    return value;
  }

  try {
    return Buffer.from(value, 'latin1').toString('utf8');
  } catch {
    return value;
  }
};

/**
 * Normaliza los campos de un usuario para que la interfaz reciba texto legible.
 * @param {object} usuario - Registro de usuario devuelto por MySQL.
 * @returns {object} Usuario con campos de texto corregidos.
 */
const normalizarUsuario = (usuario) => ({
  ...usuario,
  nombre: normalizarTexto(usuario.nombre),
  email: normalizarTexto(usuario.email),
  rol: normalizarTexto(usuario.rol)
});


// TODO: revisar error en registro de usuarios
// Actualmente POST /api/usuarios/register devuelve 500 en tests de integración
// Esto impide completar correctamente el flujo login → perfil
// Posibles causas: validación, inserción en BD o hash de contraseña
export const registerUsuario = async (req, res) => {
  const { nombre, primerApellido = '', email, contrasena } = req.body;
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
      'INSERT INTO usuarios (nombre, primerApellido, email, contrasena) VALUES (?, ?, ?, ?)',
      [nombre, primerApellido, email, hash]
    );
    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario', detalle: error.message });
  }
};


export const loginUsuario = async (req, res) => {
  const { email, nombre, primerApellido, contrasena } = req.body;

  // Requerir: o bien email + contrasena, o bien nombre + primerApellido + contrasena
  if ((!email && !(nombre && primerApellido)) || !contrasena) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    let usuarios = [];

    if (nombre && primerApellido) {
      const [rows] = await db.query(
        'SELECT * FROM usuarios WHERE nombre = ? AND primerApellido = ?',
        [nombre, primerApellido]
      );
      usuarios = rows;
    } else {
      const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
      usuarios = rows;
    }

    if (usuarios.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = usuarios[0];
    const match = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!match) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'JWT_SECRET no esta configurado' });
    }

    // Generar JWT
    const token = jwt.sign(
      {
        idUsuario: usuario.idUsuario,
        nombre: normalizarTexto(usuario.nombre),
        email: normalizarTexto(usuario.email),
        rol: normalizarTexto(usuario.rol)
      },
      process.env.JWT_SECRET,
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
      'SELECT idUsuario, nombre, primerApellido, segundoApellido, email, rol, creadoEn FROM usuarios'
    );

    res.json(usuarios.map(normalizarUsuario));
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};


export const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;

    const [usuarios] = await db.query(
      'SELECT idUsuario, nombre, primerApellido, segundoApellido, email, rol, creadoEn FROM usuarios WHERE idUsuario = ?',
      [id]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(normalizarUsuario(usuarios[0]));
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};


export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, primerApellido = '', segundoApellido = '', email, rol } = req.body;
    const isAdmin = req.user?.rol?.toLowerCase() === 'admin';
    const isOwnAccount = Number(req.user?.idUsuario) === Number(id);

    if (!isAdmin && !isOwnAccount) {
      return res.status(403).json({ error: 'Solo puedes editar tu propia cuenta' });
    }

    if (!nombre || !email) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const [usuarios] = await db.query(
      'SELECT idUsuario, email, rol FROM usuarios WHERE idUsuario = ?',
      [id]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (usuarios[0].email?.toLowerCase() === SUPER_ADMIN_EMAIL) {
      return res.status(403).json({ error: 'La cuenta super admin no se puede editar' });
    }

    const [emailDuplicado] = await db.query(
      'SELECT idUsuario FROM usuarios WHERE email = ? AND idUsuario <> ?',
      [email, id]
    );

    if (emailDuplicado.length > 0) {
      return res.status(409).json({ error: 'El email ya estÃ¡ registrado' });
    }

    const nextRole = isAdmin ? (rol || usuarios[0].rol) : usuarios[0].rol;

    const [result] = await db.query(
      `UPDATE usuarios
       SET nombre = ?, primerApellido = ?, segundoApellido = ?, email = ?, rol = ?
       WHERE idUsuario = ?`,
      [nombre, primerApellido, segundoApellido, email, nextRole, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const [updatedUsers] = await db.query(
      'SELECT idUsuario, nombre, primerApellido, segundoApellido, email, rol, creadoEn FROM usuarios WHERE idUsuario = ?',
      [id]
    );

    res.json({
      mensaje: 'Usuario actualizado correctamente',
      usuario: normalizarUsuario(updatedUsers[0])
    });
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
    const isAdmin = req.user?.rol?.toLowerCase() === 'admin';
    const isOwnAccount = Number(req.user?.idUsuario) === Number(id);

    if (!isAdmin && !isOwnAccount) {
      return res.status(403).json({ error: 'Solo puedes eliminar tu propia cuenta' });
    }

    const [usuarios] = await db.query(
      'SELECT idUsuario, email FROM usuarios WHERE idUsuario = ?',
      [id]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (usuarios[0].email?.toLowerCase() === SUPER_ADMIN_EMAIL) {
      return res.status(403).json({ error: 'La cuenta super admin no se puede eliminar' });
    }

    const disabledPassword = await bcrypt.hash(`deleted-${id}-${Date.now()}`, 10);
    const deletedEmail = `deleted-user-${id}-${Date.now()}@squarestruct.local`;

    const [result] = await db.query(
      `UPDATE usuarios
       SET nombre = ?, primerApellido = ?, segundoApellido = ?, email = ?, contrasena = ?, rol = ?
       WHERE idUsuario = ?`,
      ['Usuario eliminado', '', '', deletedEmail, disabledPassword, 'usuario', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Cuenta eliminada correctamente. Los pedidos se conservan anonimizados.' });
  } catch (error) {
    res.status(500).json({
      error: 'Error al eliminar usuario',
      detalle: error.message
    });
  }
};
