# Arquitectura frontend

Este documento describe la organización interna del frontend, las capas principales y las convenciones usadas para mantener el proyecto fácil de extender.

## Stack

- React 19.
- React Router 7.
- Vite 8.
- Tailwind CSS 4.
- Axios.
- ESLint.

## Estructura principal

```txt
src/
├── api/
│   ├── client.js
│   └── support.js
├── components/
│   ├── ProtectedRoute.jsx
│   └── SupportUi.jsx
├── config/
│   └── apiRoutes.js
├── context/
│   └── AuthContext.jsx
├── layouts/
│   └── DashboardLayout.jsx
├── lib/
│   └── support.js
├── pages/
│   ├── CategoriesPage.jsx
│   ├── CreateTicketPage.jsx
│   ├── DashboardPage.jsx
│   ├── LoginPage.jsx
│   ├── NotificationsPage.jsx
│   ├── ProfilePage.jsx
│   ├── TicketDetailPage.jsx
│   ├── TicketsPage.jsx
│   └── UsersPage.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## Capas del proyecto

### 1. Configuración HTTP: `src/api/client.js`

Responsabilidades:

- Crear la instancia global de Axios.
- Tomar `baseURL` desde `VITE_API_URL`.
- Definir cabeceras JSON.
- Agregar automáticamente `Authorization: Bearer <token>` si existe sesión.
- Limpiar sesión local y redirigir a `/login` cuando la API responde `401`.

### 2. Funciones de API: `src/api/support.js`

Responsabilidades:

- Centralizar llamadas al backend.
- Evitar llamadas directas a Axios desde las páginas.
- Normalizar respuestas con `payloadFromResponse`.
- Aplicar fallback de endpoints cuando existe más de una ruta posible.

Funciones principales:

- `getDashboardStats()`
- `listTickets(params)`
- `getTicket(ticketId)`
- `createTicket(payload, attachments)`
- `updateTicketStatus(ticketId, status)`
- `assignTicket(ticketId, agentId)`
- `addTicketComment(ticketId, body)`
- `listTicketComments(ticketId)`
- `listTicketAttachments(ticketId)`
- `uploadTicketAttachment(ticketId, file)`
- `listCategories(params)`
- `createCategory(payload)`
- `updateCategory(categoryId, payload)`
- `deleteCategory(categoryId)`
- `listUsers(params)`
- `createUser(payload)`
- `updateUser(userId, payload)`
- `importUsers(payload)`
- `listNotifications()`
- `updateProfile(payload)`
- `changePassword(payload)`

### 3. Rutas de API: `src/config/apiRoutes.js`

Responsabilidades:

- Centralizar los endpoints del backend.
- Evitar strings repetidos en las páginas.
- Permitir endpoints alternativos para categorías.

Ejemplo:

```js
export const apiRoutes = {
  dashboardStats: '/dashboard/stats',
  register: '/register',
  tickets: '/tickets',
  categories: uniqueEndpoints([
    import.meta.env.VITE_CATEGORIES_ENDPOINT,
    import.meta.env.VITE_TICKET_CATEGORIES_ENDPOINT,
    '/categories',
    '/ticket-categories',
  ]),
  users: '/users',
}
```

### 4. Autenticación: `src/context/AuthContext.jsx`

Responsabilidades:

- Guardar el usuario autenticado.
- Guardar el token.
- Ejecutar login.
- Ejecutar logout.
- Actualizar datos locales del usuario.
- Exponer `isAuthenticated`.

La sesión se persiste en:

```txt
localStorage.token
localStorage.user
```

### 5. Rutas protegidas: `src/components/ProtectedRoute.jsx`

Si no existe token, redirige a:

```txt
/login
```

Si existe token, renderiza las rutas privadas.

### 6. Layout: `src/layouts/DashboardLayout.jsx`

Responsabilidades:

- Mostrar sidebar en escritorio.
- Mostrar navegación horizontal en móvil.
- Filtrar opciones de menú según rol.
- Mostrar información del usuario autenticado.
- Ejecutar logout.

### 7. Componentes UI: `src/components/SupportUi.jsx`

Componentes y helpers visuales reutilizables:

- `Icon`
- `Badge`
- `PageHeader`
- `EmptyState`
- `Panel`
- `SkeletonRows`
- `inputClass`
- `labelClass`

### 8. Helpers de dominio: `src/lib/support.js`

Incluye:

- Opciones de estado.
- Opciones de prioridad.
- Opciones de rol.
- Normalización de payloads.
- Formato de fechas.
- Obtención de título, código, categoría, agente y solicitante de un ticket.

## Rutas frontend

| Ruta | Descripción | Acceso |
| --- | --- | --- |
| `/login` | Inicio de sesión | Pública |
| `/dashboard` | Resumen general | Privada |
| `/tickets` | Listado de tickets | Privada |
| `/tickets/create` | Crear ticket | Privada |
| `/tickets/:ticketId` | Detalle del ticket | Privada |
| `/categories` | Categorías | Admin y agente |
| `/users` | Usuarios e importación | Admin |
| `/notifications` | Notificaciones | Privada |
| `/profile` | Perfil | Privada |

## Roles en navegación

| Rol | Menú visible |
| --- | --- |
| `admin` | Dashboard, Tickets, Crear ticket, Categorías, Usuarios, Notificaciones, Perfil |
| `support_agent` | Dashboard, Tickets, Crear ticket, Categorías, Notificaciones, Perfil |
| `user` | Dashboard, Tickets, Crear ticket, Notificaciones, Perfil |

La navegación solo mejora la experiencia. La autorización real debe estar en la API.

## Flujo de autenticación

```txt
Usuario envía credenciales
        ↓
POST /login
        ↓
La API devuelve token y user
        ↓
AuthContext guarda token y user en localStorage
        ↓
Axios agrega Authorization Bearer automáticamente
        ↓
ProtectedRoute permite rutas privadas
```

## Flujo de creación de ticket

```txt
Usuario completa formulario
        ↓
POST /tickets
        ↓
La API devuelve ticket creado
        ↓
Si hay adjuntos, se suben uno por uno
        ↓
POST /tickets/{ticket}/attachments
        ↓
Redirección al detalle del ticket
```

## Responsive

La interfaz está pensada para:

- Sidebar fijo en pantallas grandes.
- Navegación horizontal en pantallas pequeñas.
- Tablas en escritorio.
- Tarjetas en móvil para mejorar lectura.

## Paleta visual

- Fondo base: `#f6f7f2`.
- Sidebar: verde oscuro `#10231f`.
- Acciones principales: tonos emerald/lime.
- Texto y superficies: zinc/slate.

## Convenciones recomendadas

- No llamar Axios directamente desde páginas.
- Agregar endpoints nuevos primero en `apiRoutes.js`.
- Agregar funciones HTTP nuevas en `api/support.js`.
- Reutilizar helpers de `lib/support.js` antes de duplicar lógica.
- Mantener los componentes UI simples en `SupportUi.jsx`.
- Crear componentes separados cuando una página crezca demasiado.
