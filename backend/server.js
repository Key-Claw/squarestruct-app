// Punto de arranque del servidor
import app, { checkDbConnection } from './src/app.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await checkDbConnection();
    console.log('Conexion a base de datos correcta');
  } catch (error) {
    // El servidor sigue arrancando incluso si falla la BD (util para debug local)
    // En producción con Docker, se puede usar healthcheck + depends_on para evitar esto
    console.error(`❌ DB ERROR: ${error.code || 'UNKNOWN'} - ${error.message}`);
    console.warn('⚠️ Servidor iniciado sin conexión a la base de datos');
  }

  app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en el puerto ${PORT}`);
  });
};

startServer();
