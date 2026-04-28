// Servicio MVP para usuarios
const db = require('../db');

async function getAllUsers() {
  return db.query('SELECT * FROM usuarios');
}

module.exports = { getAllUsers };