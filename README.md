# Support Ticket Frontend

**Sistema de gestión de tickets de soporte** — SPA moderna con autenticación por roles, dashboard de estadísticas y experiencia oscura/clara.

[![Vercel](https://img.shields.io/badge/deploy-vercel-000?style=flat-square&logo=vercel)](https://support-ticket-frontend-chi.vercel.app)
[![React](https://img.shields.io/badge/react-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/vite-8-646CFF?style=flat-square&logo=vite)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Vitest](https://img.shields.io/badge/tests-vitest-6B32C3?style=flat-square&logo=vitest)](https://vitest.dev)
[![Node](https://img.shields.io/badge/node-%3E%3D20.19.0-5FA04E?style=flat-square&logo=nodedotjs)](https://nodejs.org)

## Demo

[https://support-ticket-frontend-chi.vercel.app](https://support-ticket-frontend-chi.vercel.app)

> Requiere un backend Laravel accesible con `VITE_API_URL` configurado durante el build.

## Características

### Autenticación y Seguridad
- Login con email y contraseña, sesión persistente mediante token Bearer.
- Rutas protegidas por rol (admin, agente de soporte, usuario).
- Interceptor Axios que cierra sesión automáticamente ante 401.

### Gestión de Tickets
- CRUD completo con búsqueda y filtros.
- Asignación de agentes y cambios de estado.
- Comentarios en hilo y adjuntos por ticket.
- Paginación en listados.

### Administración
- CRUD de categorías.
- CRUD e importación masiva de usuarios desde archivo.
- Dashboard con estadísticas y tickets recientes.

### Experiencia de Usuario
- Dark mode con persistencia en `localStorage` y detección de preferencia del sistema.
- Sistema de notificaciones toast con auto-dismiss y severidad (éxito, error, aviso).
- Modal de confirmación para acciones destructivas.
- Barra de progreso superior durante navegación.
- Atajos de teclado globales.

## Arquitectura y Logros Técnicos

- **API Layer por capas** — Cliente Axios con interceptores, helpers genéricos de request y funciones de dominio separadas. Normalización automática de respuestas del backend.
- **Custom Hooks** — `useAsync` para data fetching con cancelación, `useMutation` para operaciones de escritura con manejo de estados, `useKeyboardShortcuts` para atajos globales.
- **Dark Mode** — Implementado con clases CSS y `localStorage`. Detecta la preferencia del sistema operativo como valor inicial.
- **Toast System** — Sistema de notificaciones propio construido con Context API, auto-dismiss configurable y animaciones CSS.
- **UI Componentes** — Biblioteca de componentes puros (Badge, EmptyState, SkeletonRows, PaginationBar, FieldError, ConfirmModal, TopProgressBar) sin dependencias externas de UI.
- **Normalización de Datos** — Helpers que unifican respuestas del backend soportando múltiples formatos (snake_case, camelCase, distintos nombres de colección).

## Testing

El proyecto incluye pruebas unitarias con **Vitest + React Testing Library**:

| Módulo | Cobertura |
|--------|-----------|
| `api/request` | Normalización de respuestas y fallback de endpoints |
| `hooks/useAsync` | Fetching, cancelación y reload |
| `hooks/useMutation` | Estados de guardado y error |
| `components/` | PaginationBar, ConfirmModal (renderizado y eventos) |
| `context/ToastContext` | Provider y auto-dismiss con temporizadores fake |
| `lib/` | Formateo de fechas, constantes, normalizadores, accessors de ticket |

Ejecutar:
```bash
npm test        # Una vez
npm run test:watch  # Modo watch
```

## Stack

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 19 | UI y componentes |
| React Router | 7 | Enrutamiento público y privado |
| Vite | 8 | Dev server y build |
| Tailwind CSS | 4 | Estilos responsive |
| Axios | 1.17 | Cliente HTTP |
| Vitest | 4 | Testing |
| ESLint | 10 | Análisis estático |
| Vercel | — | Hosting y despliegue continuo |

## Instalación Rápida

```bash
git clone https://github.com/he-code/support-ticket-frontend.git
cd support-ticket-frontend
npm install
cp .env.example .env
```

Configurar la URL del backend en `.env`:

```bash
VITE_API_URL=http://127.0.0.1:8000/api
VITE_CATEGORIES_ENDPOINT=/categories
VITE_TICKET_CATEGORIES_ENDPOINT=/ticket-categories
```

Iniciar en desarrollo:

```bash
npm run dev
```

Disponible en [http://127.0.0.1:5173](http://127.0.0.1:5173).

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia Vite en modo desarrollo |
| `npm run build` | Genera el build en `dist/` |
| `npm run preview` | Sirve localmente el build generado |
| `npm run lint` | Ejecuta ESLint |
| `npm test` | Ejecuta Vitest |
| `npm run test:watch` | Vitest en modo watch |

## Estructura del Proyecto

```
src/
├── api/           # Cliente Axios, helpers y funciones de dominio
├── components/    # Componentes reutilizables (UI体系)
├── config/        # Rutas centralizadas de API
├── context/       # AuthContext y ToastContext
├── hooks/         # useAsync, useMutation, useKeyboardShortcuts
├── layouts/       # DashboardLayout (sidebar, header, dark mode)
├── lib/           # Helpers puros (normalización, formateo, constantes)
└── pages/         # Landing, Login, Dashboard, Tickets, etc.
```

## Roles

| Rol | Acceso |
|-----|--------|
| `admin` | Dashboard, tickets, categorías, usuarios, importación, notificaciones, perfil |
| `support_agent` | Dashboard, tickets, categorías, notificaciones, perfil |
| `user` | Dashboard, tickets propios, crear tickets, notificaciones, perfil |

La interfaz oculta opciones según el rol; la autorización real se valida en el backend.

## Despliegue en Vercel

| Campo | Valor |
|-------|-------|
| Framework | Vite |
| Install command | `npm install` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js | `24.x` o compatible (`>=20.19.0 <25`) |

Variables de entorno requeridas en Vercel:

```
VITE_API_URL=https://api.midominio.com/api
```

El archivo [`vercel.json`](vercel.json) mantiene el fallback SPA para rutas como `/tickets/1` o `/profile`.

## Documentación

- [`docs/00-indice.md`](docs/00-indice.md) — Índice general
- [`docs/01-instalacion.md`](docs/01-instalacion.md) — Entorno local
- [`docs/02-arquitectura-frontend.md`](docs/02-arquitectura-frontend.md) — Estructura y flujo interno
- [`docs/03-contrato-api.md`](docs/03-contrato-api.md) — Endpoints y contratos
- [`docs/04-guia-de-uso.md`](docs/04-guia-de-uso.md) — Guía funcional por pantalla
- [`docs/05-importacion-usuarios.md`](docs/05-importacion-usuarios.md) — Importación masiva
- [`docs/06-despliegue.md`](docs/06-despliegue.md) — Vercel, Netlify o servidor estático
- [`docs/07-mantenimiento.md`](docs/07-mantenimiento.md) — Convenciones y mejoras
- [`docs/08-solucion-problemas.md`](docs/08-solucion-problemas.md) — Errores frecuentes
- [`docs/09-checklist-repositorio.md`](docs/09-checklist-repositorio.md) — Checklist de publicación
