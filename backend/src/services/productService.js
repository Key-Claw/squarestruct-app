// Servicio MVP para productos
const db = require('../db');

async function getAllProducts() {
  // Lógica mínima para MVP
  return db.query('SELECT * FROM productos');
}

module.exports = { getAllProducts };