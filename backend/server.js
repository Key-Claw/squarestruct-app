// dotenv lee el archivo `.env` y copia sus valores a `process.env`.
// Lo cargamos aquí, en el punto de entrada, para que esas variables existan
// antes de importar `src/app.js` y crear la conexión a la base de datos.
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Punto de arranque del servidor. A partir de aquí, `app.js` ya puede leer
// `process.env.PORT`, `process.env.DB_USER`, `process.env.DB_PASSWORD`, etc.
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
