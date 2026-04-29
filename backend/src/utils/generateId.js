// Utilidad simple para generar IDs (MVP)
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

module.exports = generateId;