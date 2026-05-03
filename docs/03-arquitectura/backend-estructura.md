# Estructura del backend

## Objetivo

El backend se encarga de recibir peticiones, aplicar la lógica de negocio, acceder a la base de datos y devolver respuestas al frontend.

Está organizado por responsabilidades para que el código sea más fácil de entender, mantener y ampliar.

## Estructura principal

```text
backend/
  db/
    schema.sql       Define las tablas
    seeds.sql        Inserta datos de prueba
    migrations/      Cambios futuros de base de datos
    backups/         Copias de seguridad
  postman/           Colecciones para probar la API
  src/
    config/          Configuración general
    controllers/     Gestionan las peticiones HTTP
    services/        Lógica reutilizable
    routes/          Definen los endpoints
    middlewares/     Autenticación y validaciones
    utils/           Funciones auxiliares
    app.js           Configura Express
  tests/             Pruebas del backend
  server.js          Arranca el servidor
```

## Responsabilidad de cada carpeta

| Carpeta | Responsabilidad |
| --- | --- |
| `routes/` | Decide qué controlador se ejecuta según la URL. |
| `controllers/` | Recibe `req` y `res`, valida el flujo y responde al cliente. |
| `services/` | Contiene lógica reutilizable, por ejemplo operaciones de usuarios o productos. |
| `middlewares/` | Ejecuta comprobaciones antes del controlador, como validar JWT. |
| `config/` | Centraliza configuración como puerto o conexión a base de datos. |
| `utils/` | Guarda funciones pequeñas reutilizables. |
| `db/` | Contiene scripts SQL de estructura y datos iniciales. |

## Flujo de una petición

Ejemplo con productos:

```text
frontend -> GET /api/productos -> route -> controller -> service/base de datos -> respuesta JSON
```

Explicado paso a paso:

1. El frontend pide la lista de productos.
2. La ruta `/api/productos` recibe la petición.
3. El controlador decide qué hacer.
4. El servicio o la consulta obtiene los datos.
5. El backend devuelve JSON al frontend.

## Patrón usado

El backend sigue esta idea:

```text
Ruta -> Controlador -> Servicio -> Base de datos
```

Esto permite separar responsabilidades:

- Las rutas no contienen lógica compleja.
- Los controladores organizan la respuesta.
- Los servicios reutilizan lógica.
- La base de datos queda separada del resto del flujo.

## Ejemplo sencillo

```js
// productosController.js
export const getProductos = async (req, res) => {
  const productos = await productService.getAllProducts();
  res.json(productos);
};
```

## Idea clave para explicar

El backend está dividido en capas. Cada capa tiene una función clara, lo que facilita detectar errores y añadir nuevas funcionalidades.
