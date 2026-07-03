# Despliegue

Esta guía explica cómo publicar el frontend en producción.

## 1. Preparar variables de entorno

En producción configura:

```bash
VITE_API_URL=https://api.midominio.com/api
VITE_CATEGORIES_ENDPOINT=/categories
VITE_TICKET_CATEGORIES_ENDPOINT=/ticket-categories
```

Importante: las variables `VITE_*` se inyectan al momento de generar el build. Si cambias una variable, debes generar un nuevo build.

## 2. Validar antes del build

Ejecuta:

```bash
npm run lint
npm run build
```

El build genera:

```txt
dist/
```

## 3. Despliegue en Vercel

El proyecto incluye:

```txt
vercel.json
```

Contenido esperado:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Configuración en Vercel:

| Campo | Valor |
| --- | --- |
| Framework | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | `npm install` |

Agrega las variables de entorno en el panel del proyecto.

## 4. Despliegue en Netlify

El proyecto incluye:

```txt
public/_redirects
```

Contenido:

```txt
/* /index.html 200
```

Configuración en Netlify:

| Campo | Valor |
| --- | --- |
| Build command | `npm run build` |
| Publish directory | `dist` |

Agrega las variables de entorno en el panel del sitio.

## 5. Despliegue en servidor estático propio

Genera el build:

```bash
npm run build
```

Copia el contenido de:

```txt
dist/
```

al servidor web.

Debes configurar fallback a:

```txt
index.html
```

Esto es necesario para que rutas como estas funcionen al refrescar:

```txt
/tickets/1
/profile
/users
```

## 6. Configuración del backend para producción

Antes de publicar, confirma:

- CORS permite el dominio del frontend.
- `VITE_API_URL` apunta al dominio correcto del backend.
- El backend responde bajo `/api`.
- Laravel Sanctum acepta tokens Bearer.
- Las rutas protegidas exigen autenticación.
- Las políticas de autorización están configuradas.
- El almacenamiento de adjuntos está configurado.
- Los límites de subida permiten los archivos esperados.
- PHP `zip` está habilitado si se usará XLSX.

## 7. Checklist funcional después de desplegar

Prueba con una cuenta real:

- Iniciar sesión.
- Ver dashboard.
- Listar tickets.
- Crear ticket.
- Abrir detalle.
- Cambiar estado.
- Asignar agente.
- Comentar.
- Subir adjunto.
- Ver categorías.
- Crear categoría con admin.
- Ver usuarios con admin.
- Importar usuarios con admin.
- Ver notificaciones.
- Actualizar perfil.
- Cambiar contraseña.
- Cerrar sesión.

## 8. Problemas comunes en producción

### Pantalla en blanco al refrescar una ruta

Causa:

```txt
No existe fallback SPA hacia index.html.
```

Solución:

- En Vercel: revisar `vercel.json`.
- En Netlify: revisar `public/_redirects`.
- En servidor propio: configurar fallback en Nginx/Apache.

### Login funciona en Postman pero no en navegador

Causa probable:

```txt
CORS no permite el dominio del frontend.
```

Solución:

- Agregar el dominio del frontend en CORS del backend.
- Revisar cabeceras permitidas.
- Revisar métodos permitidos.

### La app sigue apuntando a la API anterior

Causa:

```txt
Las variables VITE_* se inyectaron en un build anterior.
```

Solución:

- Actualizar variables de entorno.
- Generar un nuevo build.
- Volver a desplegar.
