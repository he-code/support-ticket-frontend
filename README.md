# Support Ticket Frontend

Frontend web para una mesa de soporte y gestion de tickets. La aplicacion permite iniciar sesion, consultar un dashboard, crear tickets, administrar categorias, gestionar usuarios, importar usuarios de forma masiva, revisar notificaciones y actualizar el perfil del usuario autenticado.

Esta construido con React, Vite, Tailwind CSS y Axios. Consume una API Laravel protegida con tokens Bearer compatibles con Laravel Sanctum.

## Demo

Produccion en Vercel:

```txt
https://support-ticket-frontend-chi.vercel.app
```

> La aplicacion requiere un backend Laravel accesible y `VITE_API_URL` configurado durante el build.

## Caracteristicas

- Autenticacion con correo y contrasena.
- Sesion persistida mediante token Bearer.
- Rutas privadas para usuarios autenticados.
- Dashboard con estadisticas y tickets recientes.
- Listado de tickets con busqueda y filtros.
- Creacion de tickets con categoria, prioridad y adjuntos.
- Detalle de ticket con comentarios, adjuntos, estados y asignacion de agente.
- Administracion de categorias.
- Administracion e importacion masiva de usuarios.
- Notificaciones y marcado de lectura.
- Perfil de usuario y cambio de contrasena.
- Soporte para distintas respuestas del backend mediante helpers de normalizacion.

## Stack

| Tecnologia | Uso |
| --- | --- |
| React 19 | Interfaz de usuario |
| React Router 7 | Rutas publicas y privadas |
| Vite 8 | Desarrollo local y build de produccion |
| Tailwind CSS 4 | Estilos responsive |
| Axios | Cliente HTTP |
| ESLint | Analisis estatico |
| Vercel | Hosting del frontend |

## Requisitos

- Node.js `>=20.19.0 <25`.
- NPM.
- Backend Laravel accesible bajo `/api`.
- CORS del backend habilitado para el dominio del frontend.
- Token Bearer compatible con Laravel Sanctum.

## Instalacion rapida

```bash
git clone https://github.com/he-code/support-ticket-frontend.git
cd support-ticket-frontend
npm install
cp .env.example .env
```

Configura la URL del backend:

```bash
VITE_API_URL=http://127.0.0.1:8000/api
VITE_CATEGORIES_ENDPOINT=/categories
VITE_TICKET_CATEGORIES_ENDPOINT=/ticket-categories
```

Levanta el servidor local:

```bash
npm run dev
```

La app queda disponible normalmente en:

```txt
http://127.0.0.1:5173
```

## Variables de entorno

| Variable | Obligatoria | Ejemplo | Descripcion |
| --- | --- | --- | --- |
| `VITE_API_URL` | Si | `https://api.midominio.com/api` | URL base de la API Laravel. |
| `VITE_CATEGORIES_ENDPOINT` | No | `/categories` | Ruta principal para categorias. |
| `VITE_TICKET_CATEGORIES_ENDPOINT` | No | `/ticket-categories` | Ruta alternativa si el backend usa otro nombre. |

Las variables `VITE_*` se inyectan durante el build. Si cambias una variable en Vercel, debes generar un nuevo deployment.

## Scripts

| Comando | Descripcion |
| --- | --- |
| `npm run dev` | Inicia Vite en modo desarrollo. |
| `npm run lint` | Ejecuta ESLint. |
| `npm run build` | Genera el build en `dist/`. |
| `npm run preview` | Sirve localmente el build generado. |

## Estructura

```txt
support-ticket-frontend/
|-- .github/workflows/      # CI de lint y build
|-- docs/                   # Documentacion tecnica y funcional
|-- public/                 # Assets publicos y fallback para Netlify
|-- src/
|   |-- api/                # Cliente Axios y funciones HTTP
|   |-- components/         # Componentes reutilizables
|   |-- config/             # Rutas centralizadas de API
|   |-- context/            # Contexto de autenticacion
|   |-- layouts/            # Layout principal autenticado
|   |-- lib/                # Helpers de dominio y formato
|   `-- pages/              # Pantallas principales
|-- .env.example            # Plantilla de variables
|-- package.json            # Dependencias y scripts
|-- vercel.json             # Fallback SPA para Vercel
`-- vite.config.js          # Configuracion de Vite
```

## Roles

| Rol | Acceso principal |
| --- | --- |
| `admin` | Dashboard, tickets, categorias, usuarios, importacion, notificaciones y perfil. |
| `support_agent` | Dashboard, tickets, categorias, notificaciones y perfil. |
| `user` | Dashboard, tickets propios, creacion de tickets, notificaciones y perfil. |

La interfaz oculta opciones segun el rol, pero la autorizacion real siempre debe validarse en el backend.

## Backend esperado

El frontend espera estas rutas principales:

```txt
POST /login
POST /logout
GET /dashboard/stats
GET /me
PATCH /profile
PATCH /password
GET /tickets
POST /tickets
GET /tickets/{ticket}
PATCH /tickets/{ticket}/status
PATCH /tickets/{ticket}/assign
GET /tickets/{ticket}/comments
POST /tickets/{ticket}/comments
GET /tickets/{ticket}/attachments
POST /tickets/{ticket}/attachments
GET /categories
POST /categories
PATCH /categories/{category}
DELETE /categories/{category}
GET /support-agents
GET /users
PATCH /users/{user}/role
GET /users/imports
POST /users/import
GET /notifications
PATCH /notifications/read-all
PATCH /notifications/{notification}/read
```

El contrato completo esta en [`docs/03-contrato-api.md`](docs/03-contrato-api.md).

## Despliegue en Vercel

El proyecto esta configurado como aplicacion Vite. Vercel debe usar:

| Campo | Valor |
| --- | --- |
| Framework | Vite |
| Install command | `npm install` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js | `24.x` o una version compatible con `>=20.19.0 <25` |

Configura en Vercel:

```txt
VITE_API_URL=https://api.midominio.com/api
VITE_CATEGORIES_ENDPOINT=/categories
VITE_TICKET_CATEGORIES_ENDPOINT=/ticket-categories
```

El archivo [`vercel.json`](vercel.json) mantiene el fallback de SPA para que rutas como `/tickets/1` o `/profile` funcionen al refrescar.

## CI

El workflow [`CI`](.github/workflows/ci.yml) corre en `push` a `main` y en pull requests:

- `npm ci`
- `npm run lint`
- `npm run build`

## Documentacion

- [`docs/00-indice.md`](docs/00-indice.md): indice general.
- [`docs/01-instalacion.md`](docs/01-instalacion.md): instalacion y entorno local.
- [`docs/02-arquitectura-frontend.md`](docs/02-arquitectura-frontend.md): estructura y flujo interno.
- [`docs/03-contrato-api.md`](docs/03-contrato-api.md): endpoints, payloads y respuestas.
- [`docs/04-guia-de-uso.md`](docs/04-guia-de-uso.md): guia funcional por pantalla.
- [`docs/05-importacion-usuarios.md`](docs/05-importacion-usuarios.md): importacion masiva.
- [`docs/06-despliegue.md`](docs/06-despliegue.md): despliegue en Vercel, Netlify o servidor estatico.
- [`docs/07-mantenimiento.md`](docs/07-mantenimiento.md): convenciones y mejoras futuras.
- [`docs/08-solucion-problemas.md`](docs/08-solucion-problemas.md): errores frecuentes.
- [`docs/09-checklist-repositorio.md`](docs/09-checklist-repositorio.md): checklist antes de publicar.

## Estado del proyecto

El frontend cubre un flujo base de mesa de soporte. Mejoras recomendadas:

- Paginacion visible en tickets, usuarios, notificaciones e importaciones.
- Pruebas automatizadas con Vitest y React Testing Library.
- Pruebas E2E con Playwright.
- Pantallas para canales, equipos, etiquetas y reportes.
- Mejor manejo de errores por campo en formularios.
- Mejoras de accesibilidad y estados de carga.
