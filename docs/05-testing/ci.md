# Validación local del CI

Esta guía sirve para comprobar en local lo mismo que revisa GitHub Actions antes de hacer `push` o abrir una Pull Request.

El workflow real está en `.github/workflows/tests.yml` y se ejecuta en:

- `push` a `dev` o `main`.
- Pull Requests hacia `dev` o `main`.

GitHub Actions usa Node.js 20 y ejecuta dos jobs en paralelo:

- `backend-tests`: instala dependencias del backend, levanta MySQL, carga esquema/seeds y ejecuta tests.
- `frontend-build`: instala dependencias del frontend, ejecuta tests, lint y build.

## 1. Comprobar instalación reproducible

El CI usa `npm ci`, no `npm install`.

La diferencia es importante:

- `npm install` puede actualizar el `package-lock.json`.
- `npm ci` exige que `package.json` y `package-lock.json` estén sincronizados.
- Si el lockfile está mal, el CI falla aunque en local parezca funcionar.

### Frontend

```bash
cd frontend
npx npm@10 ci --dry-run
```

Este comando comprueba que el frontend se puede instalar como lo haría GitHub Actions.

Se usa `npm@10` porque el workflow trabaja con Node.js 20, que normalmente usa npm 10. Es útil si en local tienes otra versión de Node/npm.

El modificador `--dry-run` no reinstala todo el proyecto: solo simula la instalación y detecta errores de sincronización del lockfile.

### Backend

```bash
cd backend
npm ci --dry-run
```

Este comando hace la misma comprobación para el backend.

Sirve para detectar si `backend/package-lock.json` está desactualizado respecto a `backend/package.json`.

## 2. Validar frontend

Estos comandos deben ejecutarse dentro de `frontend/`.

```bash
cd frontend
```

### Ejecutar lint

```bash
npm run lint
```

Comprueba reglas de calidad del código con ESLint.

Detecta problemas como:

- imports no usados,
- variables sin utilizar,
- errores de hooks de React,
- patrones que pueden generar renders innecesarios,
- problemas básicos de estilo y mantenimiento.

Si este comando falla, el job `frontend-build` también fallará.

### Ejecutar tests del frontend

```bash
npm run test:run
```

Ejecuta los tests de Vitest una sola vez.

Sirve para comprobar que los componentes y comportamientos cubiertos por tests siguen funcionando.

En CI se usa `test:run` porque no deja Vitest en modo observación.

### Compilar el frontend

```bash
npm run build
```

Compila la aplicación React con Vite.

Este paso valida que:

- los imports existen,
- las rutas de assets son correctas,
- el CSS puede procesarse,
- no hay errores de build,
- la app puede generar una versión lista para producción.

Si falta un archivo CSS, una imagen o un import está mal escrito, normalmente este comando lo detecta.

## 3. Validar backend

Estos comandos deben ejecutarse dentro de `backend/`.

```bash
cd backend
```

### Ejecutar tests del backend

```bash
npm test
```

Ejecuta Jest con los tests del backend.

En GitHub Actions, antes de este comando se crea una base de datos MySQL de pruebas, se carga `db/schema.sql` y después `db/seeds.sql`.

En local, este comando solo funcionará si tienes configurada una base de datos compatible con las variables que usa el backend.

Variables importantes:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `NODE_ENV`

## 4. Validación rápida antes de hacer push

Secuencia recomendada para cambios de frontend:

```bash
cd frontend
npx npm@10 ci --dry-run
npm run lint
npm run test:run
npm run build
```

Secuencia recomendada para cambios de backend:

```bash
cd backend
npm ci --dry-run
npm test
```

Si se han tocado frontend y backend, conviene ejecutar ambas secuencias.

## 5. Cuando falla `npm ci`

Si el error dice algo parecido a:

```text
npm ci can only install packages when your package.json and package-lock.json are in sync
```

significa que el lockfile no coincide con las dependencias declaradas.

Para corregirlo:

```bash
cd frontend
npx npm@10 install --package-lock-only
```

o, para backend:

```bash
cd backend
npm install --package-lock-only
```

Después hay que volver a validar:

```bash
npx npm@10 ci --dry-run
```

Y hacer commit del `package-lock.json` actualizado.

## 6. Notas sobre MySQL en CI

El job de backend usa MySQL 8.4 como servicio temporal dentro de GitHub Actions.

El workflow:

1. Arranca MySQL.
2. Espera hasta que responde con `mysqladmin ping`.
3. Carga `backend/db/schema.sql`.
4. Carga `backend/db/seeds.sql`.
5. Ejecuta `npm test`.

Esto permite que los tests de integración tengan una base de datos limpia y predecible en cada ejecución.

## 7. Qué revisar si el CI falla

Si falla frontend:

- Revisar primero el paso exacto: `npm ci`, `test:run`, `lint` o `build`.
- Si falla `npm ci`, revisar `package-lock.json`.
- Si falla `lint`, ejecutar `npm run lint` en local.
- Si falla `build`, ejecutar `npm run build` y revisar imports/assets.

Si falla backend:

- Revisar si falló MySQL, carga de schema/seeds o Jest.
- Comprobar que las variables de entorno del workflow coinciden con las que lee el backend.
- Revisar si el test depende de datos que no están en `seeds.sql`.

