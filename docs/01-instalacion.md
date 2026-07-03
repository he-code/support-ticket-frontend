# Instalación y configuración

Esta guía explica cómo levantar el frontend en desarrollo y conectarlo con el backend Laravel `support-ticket-api`.

## 1. Requisitos previos

Instala o verifica lo siguiente:

- Node.js 20 o superior.
- NPM.
- Git.
- Backend Laravel ejecutándose.
- Base de datos del backend migrada y con usuarios de prueba.
- CORS del backend habilitado para el origen del frontend.

Verifica Node y NPM:

```bash
node -v
npm -v
```

## 2. Clonar el proyecto

```bash
git clone <url-del-repositorio>
cd support-ticket-frontend
```

## 3. Instalar dependencias

```bash
npm install
```

No copies `node_modules` desde otro equipo. Esa carpeta se debe regenerar con `npm install`.

## 4. Crear archivo `.env`

Copia la plantilla:

```bash
cp .env.example .env
```

En Windows PowerShell puedes usar:

```powershell
Copy-Item .env.example .env
```

## 5. Configurar la URL de la API

Edita `.env`:

```bash
VITE_API_URL=http://127.0.0.1:8000/api
VITE_CATEGORIES_ENDPOINT=/categories
VITE_TICKET_CATEGORIES_ENDPOINT=/ticket-categories
```

Usa `127.0.0.1` si el backend corre localmente con:

```bash
php artisan serve
```

Ejemplo de backend:

```txt
http://127.0.0.1:8000
```

Entonces la API debe quedar como:

```txt
http://127.0.0.1:8000/api
```

## 6. Levantar el backend

En el proyecto Laravel:

```bash
php artisan serve
```

Confirma que la API responda en:

```txt
http://127.0.0.1:8000/api
```

## 7. Levantar el frontend

En el proyecto frontend:

```bash
npm run dev
```

Vite normalmente mostrará una URL similar a:

```txt
http://127.0.0.1:5173
```

Abre esa URL en el navegador.

## 8. Configurar CORS en el backend

El backend debe permitir el origen del frontend:

```txt
http://127.0.0.1:5173
http://localhost:5173
```

Si CORS no está configurado, el login y las peticiones autenticadas fallarán desde el navegador aunque funcionen en Postman.

## 9. Autenticación esperada

El frontend envía login a:

```txt
POST /login
```

Respuesta mínima esperada:

```json
{
  "token": "plain-text-token",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

También se acepta una respuesta envuelta dentro de `data`:

```json
{
  "data": {
    "token": "plain-text-token",
    "user": {
      "id": 1,
      "name": "Admin",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

El token se guarda en `localStorage` bajo la clave:

```txt
token
```

El usuario autenticado se guarda bajo:

```txt
user
```

En cada petición autenticada se envía:

```txt
Authorization: Bearer <token>
```

## 10. Verificación inicial

Después de iniciar sesión, revisa:

- `/dashboard`: debe cargar estadísticas o tickets recientes.
- `/tickets`: debe listar tickets.
- `/tickets/create`: debe permitir crear un ticket.
- `/profile`: debe mostrar información del usuario.

## 11. Validar antes de subir cambios

Ejecuta:

```bash
npm run lint
npm run build
```

Si el build falla por dependencias nativas de Vite/Rolldown, elimina dependencias instaladas y reinstala:

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

En Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm run build
```

## 12. Archivos que no deben subirse

No subas:

```txt
node_modules/
dist/
.env
*.log
```

Sube solo `.env.example`, no `.env`.
