// Utilidad simple para formatear fechas (MVP)
function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

module.exports = formatDate;