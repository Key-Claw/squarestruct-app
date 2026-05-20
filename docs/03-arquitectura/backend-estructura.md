
# Estructura real del backend

## Objetivo

El backend recibe peticiones, aplica la lógica de negocio, accede a la base de datos y responde al frontend. Está organizado en capas para facilitar la defensa DAW, el mantenimiento y la ampliación profesional.

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


## Buenas prácticas y defensa DAW

- Explica la separación real de rutas, controladores, servicios y middlewares.
- Justifica la estructura en capas para facilitar pruebas, mantenimiento y ampliaciones.
- Muestra ejemplos reales de flujo de petición y respuesta.
- Relaciona la estructura con la seguridad y la validación de datos.
