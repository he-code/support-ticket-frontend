# Support Ticket Frontend

Frontend web para una mesa de soporte y gestión de tickets. La aplicación permite iniciar sesión, consultar un dashboard, crear tickets, administrar categorías, gestionar usuarios, importar usuarios masivamente, revisar notificaciones y actualizar el perfil del usuario autenticado.

El proyecto está desarrollado con React, Vite, Tailwind CSS y Axios. Consume una API Laravel protegida con tokens Bearer de Laravel Sanctum.

## Tabla de contenido

- [Características principales](#características-principales)
- [Stack técnico](#stack-técnico)
- [Requisitos](#requisitos)
- [Instalación rápida](#instalación-rápida)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Roles contemplados](#roles-contemplados)
- [Backend requerido](#backend-requerido)
- [Documentación completa](#documentación-completa)
- [Despliegue](#despliegue)
- [Buenas prácticas para GitHub](#buenas-prácticas-para-github)
- [Estado del proyecto](#estado-del-proyecto)

## Características principales

- Autenticación con correo y contraseña.
- Persistencia de sesión en `localStorage` mediante token Bearer.
- Cierre de sesión con limpieza local de credenciales.
- Rutas privadas protegidas con `ProtectedRoute`.
- Layout autenticado con sidebar en escritorio y navegación horizontal en móvil.
- Dashboard con estadísticas generales y tickets recientes.
- Listado de tickets con búsqueda y filtros.
- Creación de tickets con categoría, prioridad y adjuntos.
- Detalle de ticket con información general, comentarios, adjuntos, cambio de estado y asignación de agente.
- Administración de categorías.
- Administración de usuarios para rol administrador.
- Importación masiva de usuarios mediante archivos CSV, TXT o XLSX.
- Notificaciones con opción de marcar como leídas.
- Perfil de usuario y cambio de contraseña.
- Compatibilidad parcial con distintas formas de respuesta del backend mediante helpers de normalización.

## Stack técnico

| Tecnología | Uso dentro del proyecto |
| --- | --- |
| React 19 | Construcción de interfaz de usuario |
| React Router 7 | Rutas públicas y privadas |
| Vite 8 | Servidor de desarrollo y build de producción |
| Tailwind CSS 4 | Estilos y diseño responsive |
| Axios | Cliente HTTP para consumir la API |
| ESLint | Revisión estática del código |

## Requisitos

- Node.js 20 o superior.
- NPM.
- Backend `support-ticket-api` ejecutándose y accesible.
- Backend con rutas bajo `/api`.
- Token Bearer compatible con Laravel Sanctum.
- CORS configurado para permitir el origen del frontend.

## Instalación rápida

Clona el repositorio e instala dependencias:

```bash
git clone <url-del-repositorio>
cd support-ticket-frontend
npm install
```

Crea el archivo de entorno:

```bash
cp .env.example .env
```

Configura la URL de la API en `.env`:

```bash
VITE_API_URL=http://127.0.0.1:8000/api
```

Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

La aplicación quedará disponible normalmente en:

```txt
http://127.0.0.1:5173
```

## Variables de entorno

| Variable | Obligatoria | Valor recomendado en desarrollo | Descripción |
| --- | --- | --- | --- |
| `VITE_API_URL` | Sí | `http://127.0.0.1:8000/api` | URL base de la API Laravel. |
| `VITE_CATEGORIES_ENDPOINT` | No | `/categories` | Ruta principal para categorías. |
| `VITE_TICKET_CATEGORIES_ENDPOINT` | No | `/ticket-categories` | Ruta alternativa para categorías si el backend usa otro nombre. |

Ejemplo:

```bash
VITE_API_URL=http://127.0.0.1:8000/api
VITE_CATEGORIES_ENDPOINT=/categories
VITE_TICKET_CATEGORIES_ENDPOINT=/ticket-categories
```

> Importante: las variables `VITE_*` se inyectan durante el build. Si cambias una variable de entorno en producción, debes generar un nuevo build.

## Scripts disponibles

```bash
npm run dev
```

Levanta el servidor de desarrollo.

```bash
npm run lint
```

Ejecuta ESLint sobre el proyecto.

```bash
npm run build
```

Genera el build de producción en `dist/`.

```bash
npm run preview
```

Sirve localmente el build generado para revisión.

## Estructura del proyecto

```txt
support-ticket-frontend/
├── docs/                      # Documentación técnica y funcional
├── public/                    # Archivos públicos estáticos
├── src/
│   ├── api/                   # Cliente Axios y funciones HTTP
│   ├── components/            # Componentes reutilizables
│   ├── config/                # Rutas centralizadas de API
│   ├── context/               # Contexto de autenticación
│   ├── layouts/               # Layout principal autenticado
│   ├── lib/                   # Helpers de dominio y formato
│   └── pages/                 # Pantallas principales
├── .env.example               # Plantilla de variables de entorno
├── package.json               # Dependencias y scripts
├── vercel.json                # Fallback SPA para Vercel
└── vite.config.js             # Configuración de Vite
```

## Roles contemplados

| Rol | Acceso principal |
| --- | --- |
| `admin` | Dashboard, tickets, categorías, usuarios, importación, notificaciones y perfil. |
| `support_agent` | Dashboard, tickets, categorías, notificaciones y perfil. |
| `user` | Dashboard, tickets propios, creación de tickets, notificaciones y perfil. |

La interfaz oculta opciones según el rol, pero la seguridad real debe validarse siempre en el backend.

## Backend requerido

El frontend espera que el backend exponga, como mínimo, estas rutas:

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

El detalle completo del contrato está en [`docs/03-contrato-api.md`](docs/03-contrato-api.md).

## Documentación completa

- [`docs/00-indice.md`](docs/00-indice.md): índice general de documentación.
- [`docs/01-instalacion.md`](docs/01-instalacion.md): instalación, entorno local y conexión con backend.
- [`docs/02-arquitectura-frontend.md`](docs/02-arquitectura-frontend.md): estructura, capas, rutas y flujo interno.
- [`docs/03-contrato-api.md`](docs/03-contrato-api.md): endpoints, payloads y respuestas esperadas.
- [`docs/04-guia-de-uso.md`](docs/04-guia-de-uso.md): guía funcional por pantalla.
- [`docs/05-importacion-usuarios.md`](docs/05-importacion-usuarios.md): importación masiva de usuarios.
- [`docs/06-despliegue.md`](docs/06-despliegue.md): despliegue en Vercel, Netlify o servidor estático.
- [`docs/07-mantenimiento.md`](docs/07-mantenimiento.md): convenciones y mejoras futuras.
- [`docs/08-solucion-problemas.md`](docs/08-solucion-problemas.md): errores frecuentes y soluciones.
- [`docs/09-checklist-repositorio.md`](docs/09-checklist-repositorio.md): limpieza del repositorio antes de subir a GitHub.

## Despliegue

Genera el build:

```bash
npm run build
```

El resultado queda en:

```txt
dist/
```

El proyecto incluye soporte para SPA routing en:

- Vercel: `vercel.json`.
- Netlify: `public/_redirects`.

Consulta la guía completa en [`docs/06-despliegue.md`](docs/06-despliegue.md).

## Buenas prácticas para GitHub

No subas al repositorio:

```txt
node_modules/
dist/
.env
*.log
.git/ dentro de un ZIP
```

Sí deben subirse:

```txt
src/
public/
docs/
package.json
package-lock.json
.env.example
README.md
vite.config.js
vercel.json
```

Para una guía más detallada revisa [`docs/09-checklist-repositorio.md`](docs/09-checklist-repositorio.md).

## Estado del proyecto

El frontend está funcional para un flujo base de mesa de soporte. Las mejoras recomendadas para una siguiente fase son:

- Paginación visible en tickets, usuarios, notificaciones e importaciones.
- Pruebas automatizadas con Vitest y React Testing Library.
- Pruebas E2E con Playwright.
- Pantallas para canales, equipos, etiquetas y reportes.
- Mejor manejo de errores por campo en formularios.
- Mejoras de accesibilidad y estados de carga.
