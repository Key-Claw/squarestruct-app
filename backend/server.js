// Punto de arranque del servidor
import app, { checkDbConnection } from './src/app.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await checkDbConnection();
    console.log('Conexion a base de datos correcta');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos. Revisa DB_HOST, DB_USER y DB_PASSWORD en backend/.env');
    console.error(`Detalle: ${error.code || 'UNKNOWN'} - ${error.message}`);
  }

  app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en el puerto ${PORT}`);
  });
};

startServer();
