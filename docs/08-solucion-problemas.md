# Solución de problemas

Esta guía reúne errores frecuentes durante instalación, desarrollo, build y conexión con el backend.

## 1. `npm run build` falla por dependencia nativa de Rolldown

Error posible:

```txt
Cannot find native binding
Cannot find module '@rolldown/binding-linux-x64-gnu'
```

Causa probable:

- `node_modules` fue copiado desde otro sistema operativo.
- Faltan dependencias opcionales.
- NPM no instaló correctamente dependencias nativas.

Solución recomendada:

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

Si quieres conservar `package-lock.json`, prueba primero:

```bash
rm -rf node_modules
npm install
npm run build
```

## 2. `eslint: Permission denied`

Causa probable:

- El proyecto fue descomprimido en Linux desde un ZIP generado en Windows y los binarios de `node_modules/.bin` no tienen permisos de ejecución.

Solución temporal en Linux/macOS:

```bash
chmod -R u+x node_modules/.bin
npm run lint
```

Solución recomendada:

```bash
rm -rf node_modules
npm install
npm run lint
```

## 3. El login funciona en Postman, pero no en el navegador

Causa probable:

```txt
CORS no permite el origen del frontend.
```

Verifica en el backend que estén permitidos:

```txt
http://127.0.0.1:5173
http://localhost:5173
```

También revisa:

- Métodos permitidos: `GET`, `POST`, `PATCH`, `DELETE`, `OPTIONS`.
- Cabeceras permitidas: `Authorization`, `Content-Type`, `Accept`.
- Ruta base correcta en `VITE_API_URL`.

## 4. Después de iniciar sesión vuelve a `/login`

Causas posibles:

- La API responde `401` en una ruta protegida.
- El token no se está enviando.
- El token expiró o fue revocado.
- El backend no reconoce el token Bearer.

Revisa en DevTools, pestaña Network, que la petición incluya:

```txt
Authorization: Bearer <token>
```

## 5. La API no devuelve token en login

El frontend espera alguno de estos campos:

```txt
token
access_token
accessToken
```

Respuesta mínima válida:

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

Si el backend usa otra estructura, ajusta `readAuthPayload` en:

```txt
src/context/AuthContext.jsx
```

## 6. Categorías no cargan

El frontend prueba endpoints en este orden:

1. `VITE_CATEGORIES_ENDPOINT`
2. `VITE_TICKET_CATEGORIES_ENDPOINT`
3. `/categories`
4. `/ticket-categories`

Si todos fallan, revisa:

- Que el backend tenga una ruta de categorías.
- Que el usuario tenga permisos.
- Que la ruta esté bajo `/api`.
- Que no exista error CORS.

## 7. Al refrescar `/tickets/1` aparece 404 en producción

Causa:

```txt
El servidor intenta buscar una ruta física /tickets/1.
```

Solución:

Configurar fallback SPA hacia `index.html`.

Vercel usa:

```txt
vercel.json
```

Netlify usa:

```txt
public/_redirects
```

## 8. Los adjuntos no suben

Revisa:

- Tamaño máximo permitido por backend.
- Extensiones permitidas.
- Configuración de storage en Laravel.
- Límite `upload_max_filesize` de PHP.
- Límite `post_max_size` de PHP.
- Permisos de carpeta de almacenamiento.

Formatos recomendados:

```txt
jpg, jpeg, png, pdf, txt, doc, docx
```

## 9. La importación XLSX falla

Causa probable:

```txt
La extensión PHP zip no está habilitada.
```

Solución:

- Habilitar `zip` en PHP.
- Reiniciar Laragon/Apache/Nginx/PHP-FPM.
- Probar nuevamente.

## 10. Los usuarios importados no se actualizan

Causa probable:

```txt
La opción update_existing no fue marcada.
```

Solución:

- Activar “actualizar existentes”.
- Verificar que los correos coincidan exactamente.

## 11. No aparece el menú Usuarios

El menú `/users` solo aparece si el usuario autenticado tiene:

```txt
role = admin
```

Revisa el valor guardado en `localStorage.user` o la respuesta del login.

## 12. El usuario ve una pantalla pero la acción falla con 403

Esto es esperado si el backend restringe más que la interfaz.

Ejemplo:

- El agente puede ver categorías.
- Pero crear, editar o eliminar categorías puede estar permitido solo para admin.

La autorización final siempre depende del backend.

## 13. Variables `.env` no cambian en producción

Causa:

```txt
Vite inyecta variables VITE_* en tiempo de build.
```

Solución:

1. Cambiar variable en el proveedor.
2. Generar nuevo build.
3. Desplegar nuevamente.

## 14. Se subieron archivos que no debían al repo

Archivos/carpetas que deben evitarse:

```txt
node_modules/
dist/
.env
*.log
.git/ dentro de ZIPs
```

Solución si ya fueron agregados a Git:

```bash
git rm -r --cached node_modules dist
git rm --cached .env
git rm --cached *.log
git add .gitignore
git commit -m "Clean generated and local files"
```

Si `.env` tuvo credenciales reales, cambia esas credenciales en el backend o proveedor.
