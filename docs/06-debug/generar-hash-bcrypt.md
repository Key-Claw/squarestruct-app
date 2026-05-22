# Generar hashes bcrypt para usuarios

## Objetivo

Este documento explica como generar una contrasena hasheada con `bcrypt` usando Node.js.

Esto es necesario cuando se insertan usuarios manualmente en `backend/db/seeds.sql`.

## Por que hace falta

El backend no guarda contrasenas en texto plano. En el registro de usuarios se usa:

```js
bcrypt.hash(contrasena, 10)
```

Por eso, la columna `contrasena` de la tabla `usuarios` debe guardar un hash bcrypt real.

No sirven valores de ejemplo como:

```sql
'$2b$10$hashadmin'
```

Ese texto parece un hash, pero no es un hash bcrypt valido.

## Comando para generar un hash

Desde la carpeta `backend`, ejecuta:

```bash
node -e "const bcrypt=require('bcrypt'); bcrypt.hash('Hola123!', 10).then(console.log)"
```

Este comando genera un hash para la contrasena:

```text
Hola123!
```

El resultado sera parecido a:

```text
$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Cada vez que se ejecuta puede salir un hash diferente. Eso es normal, porque bcrypt usa una sal aleatoria.

## Que significa el comando

```bash
node
```

Ejecuta Node.js.

```bash
-e
```

Permite ejecutar codigo JavaScript directamente desde la terminal.

```js
const bcrypt=require('bcrypt');
```

Importa la libreria `bcrypt`.

```js
bcrypt.hash('Hola123!', 10)
```

Genera el hash de la contrasena `Hola123!`.

El valor `10` son las rondas de coste. Es un valor habitual para desarrollo.

```js
.then(console.log)
```

Muestra el hash generado en la terminal.

## Como usarlo en seeds.sql

Despues de generar el hash, copia el resultado completo y pegalo en `backend/db/seeds.sql`.

Ejemplo:

```sql
INSERT INTO usuarios (nombre, primerApellido, segundoApellido, email, contrasena, rol)
VALUES
  ('Admin', 'SquareStruct', NULL, 'admin@sqst.com', '$2b$10$HASH_REAL_GENERADO', 'admin');
```

Si el hash se genero para `Hola123!`, el usuario podra iniciar sesion con:

```json
{
  "email": "admin@sqst.com",
  "contrasena": "Hola123!"
}
```

## Un hash o varios

Para datos de prueba se puede usar el mismo hash en varios usuarios si todos van a tener la misma contrasena.

Para una practica mas correcta, se puede generar un hash distinto para cada usuario, aunque la contrasena sea la misma.

## Flujo recomendado

1. Generar el hash con Node.js y bcrypt.
2. Sustituir los hashes falsos en `backend/db/seeds.sql`.
3. Ejecutar `backend/db/schema.sql`.
4. Ejecutar `backend/db/seeds.sql`.
5. Probar login con `POST /api/usuarios/login`.
6. Usar el token JWT para acceder a rutas protegidas.
