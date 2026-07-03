# Contrato API

Este documento resume los endpoints que el frontend espera consumir. La URL base se configura con:

```bash
VITE_API_URL=http://127.0.0.1:8000/api
```

Por eso, cuando aquí se indique `GET /tickets`, la URL completa en desarrollo será:

```txt
http://127.0.0.1:8000/api/tickets
```

## Formato general de respuesta

El frontend soporta respuestas directas:

```json
{
  "tickets": []
}
```

Y también respuestas envueltas en `data`:

```json
{
  "data": {
    "tickets": []
  }
}
```

Para colecciones, el frontend puede leer arreglos desde estas claves:

```txt
data
items
results
tickets
users
imports
support_agents
categories
comments
attachments
notifications
```

## Autenticación

### Login

```txt
POST /login
```

Payload:

```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

Respuesta esperada:

```json
{
  "message": "Login successful",
  "token": "plain-text-token",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin",
    "created_at": "2026-06-17 10:00:00"
  }
}
```

También se aceptan los nombres:

```txt
access_token
accessToken
```

### Logout

```txt
POST /logout
```

Requiere:

```txt
Authorization: Bearer <token>
```

El frontend limpia la sesión local aunque el logout falle en la API.

### Usuario autenticado

```txt
GET /me
```

Respuesta esperada:

```json
{
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

## Dashboard

### Estadísticas

```txt
GET /dashboard/stats
```

Respuesta recomendada:

```json
{
  "total_tickets": 10,
  "by_status": {
    "open": 4,
    "in_progress": 2,
    "waiting_customer": 1,
    "waiting_internal": 0,
    "resolved": 2,
    "closed": 1,
    "reopened": 0
  },
  "by_priority": {
    "low": 1,
    "medium": 4,
    "high": 3,
    "urgent": 2
  },
  "unassigned_tickets": 3,
  "assigned_to_me": 2,
  "sla": {
    "first_response_overdue": 1,
    "resolution_overdue": 0
  }
}
```

Campos alternativos que el frontend intenta leer:

```txt
total
open_tickets
in_progress_tickets
closed_tickets
open
in_progress
closed
```

## Tickets

### Listar tickets

```txt
GET /tickets
```

Parámetros soportados por el frontend/backend:

```txt
category_id
channel_id
team_id
tag_id
tag_ids[]
status
priority
search
created_from
created_to
due_before
overdue
sla
sort_by
sort_direction
assigned
assigned_to_id
```

Ejemplo:

```txt
GET /tickets?status=open&priority=high&search=impresora
```

Respuesta recomendada:

```json
{
  "tickets": [
    {
      "id": 1,
      "code": "TK-0001",
      "title": "No puedo acceder al sistema",
      "description": "Detalle del problema",
      "status": "open",
      "priority": "medium",
      "category": {
        "id": 1,
        "name": "Accesos"
      },
      "created_by": {
        "id": 3,
        "name": "Cliente Demo",
        "email": "cliente@example.com"
      },
      "assigned_to": null,
      "created_at": "2026-06-17 10:00:00"
    }
  ],
  "pagination": {
    "total": 1,
    "per_page": 10,
    "current_page": 1,
    "last_page": 1,
    "from": 1,
    "to": 1
  }
}
```

### Crear ticket

```txt
POST /tickets
```

Payload mínimo:

```json
{
  "title": "No puedo acceder",
  "description": "Detalle del problema",
  "priority": "medium",
  "category_id": 1
}
```

Campos opcionales contemplados por el contrato:

```txt
channel_id
team_id
tag_ids
first_response_due_at
resolution_due_at
custom_fields
```

Prioridades válidas:

```txt
low
medium
high
urgent
```

Estados válidos:

```txt
open
in_progress
waiting_customer
waiting_internal
resolved
closed
reopened
```

Respuesta esperada:

```json
{
  "message": "Ticket created successfully",
  "ticket": {
    "id": 1,
    "title": "No puedo acceder",
    "status": "open",
    "priority": "medium"
  }
}
```

### Ver detalle

```txt
GET /tickets/{ticket}
```

El frontend puede leer estos nombres alternativos:

| Dato | Campos aceptados |
| --- | --- |
| ID | `id`, `uuid`, `ticket_id` |
| Código | `code`, `ticket_number`, `number` |
| Título | `title`, `subject`, `name` |
| Descripción | `description`, `body`, `details` |
| Categoría | `category.name`, `category_name` |
| Solicitante | `requester`, `customer`, `created_by`, `creator`, `user` |
| Agente | `agent`, `assigned_agent`, `assigned_user`, `assigned_to`, `assignee` |
| Fecha | `created_at`, `createdAt`, `date` |

### Cambiar estado

Endpoint principal:

```txt
PATCH /tickets/{ticket}/status
```

Payload:

```json
{
  "status": "in_progress"
}
```

Fallback si el endpoint principal responde `404` o `405`:

```txt
PATCH /tickets/{ticket}
```

### Asignar agente

Endpoint principal:

```txt
PATCH /tickets/{ticket}/assign
```

Payload:

```json
{
  "assigned_to_id": 2
}
```

Para desasignar:

```json
{
  "assigned_to_id": null
}
```

Fallback si el endpoint principal responde `404` o `405`:

```txt
PATCH /tickets/{ticket}
```

## Comentarios

### Listar comentarios

```txt
GET /tickets/{ticket}/comments
```

Respuesta recomendada:

```json
{
  "comments": [
    {
      "id": 1,
      "body": "Respuesta al cliente",
      "user": {
        "id": 2,
        "name": "Agente Demo"
      },
      "created_at": "2026-06-17 10:00:00"
    }
  ]
}
```

### Crear comentario

```txt
POST /tickets/{ticket}/comments
```

Payload:

```json
{
  "body": "Respuesta al cliente"
}
```

Reglas recomendadas:

- `body` requerido.
- Mínimo 2 caracteres.
- Máximo 5000 caracteres.

## Adjuntos

### Listar adjuntos

```txt
GET /tickets/{ticket}/attachments
```

### Subir adjunto

```txt
POST /tickets/{ticket}/attachments
```

Payload `multipart/form-data`:

```txt
file
is_internal
```

En la implementación actual del frontend se envía `file`. El campo `is_internal` queda contemplado para futuras mejoras.

Reglas recomendadas:

- Tamaño máximo: 5120 KB.
- Formatos: `jpg`, `jpeg`, `png`, `pdf`, `txt`, `doc`, `docx`.
- `is_internal` solo para staff si el backend lo implementa.

### Descargar adjunto

```txt
GET /tickets/{ticket}/attachments/{attachment}/download
```

### Vista previa

```txt
GET /tickets/{ticket}/attachments/{attachment}/preview
```

## Categorías

El frontend puede probar más de un endpoint para compatibilidad.

Endpoint principal:

```txt
/categories
```

Endpoint alternativo:

```txt
/ticket-categories
```

### Listar

```txt
GET /categories
```

### Crear

```txt
POST /categories
```

Payload:

```json
{
  "name": "Facturación",
  "description": "Casos relacionados con pagos",
  "is_active": true
}
```

### Actualizar

```txt
PATCH /categories/{category}
```

Payload:

```json
{
  "name": "Facturación",
  "description": "Casos relacionados con pagos",
  "is_active": false
}
```

### Eliminar

```txt
DELETE /categories/{category}
```

Permisos recomendados:

- Listar: admin y agente.
- Crear, actualizar y eliminar: admin.

## Usuarios

### Listar usuarios

```txt
GET /users
```

Solo administrador.

Filtros esperados:

```txt
search
role
```

Respuesta recomendada:

```json
{
  "users": [
    {
      "id": 1,
      "name": "Admin",
      "email": "admin@example.com",
      "role": "admin",
      "created_at": "2026-06-17 10:00:00"
    }
  ]
}
```

### Crear usuario desde frontend

La implementación actual usa:

```txt
POST /register
```

Payload:

```json
{
  "name": "Cliente Demo",
  "email": "cliente@example.com",
  "password": "password123"
}
```

Si el rol seleccionado no coincide con el rol devuelto por `/register`, el frontend llama:

```txt
PATCH /users/{user}/role
```

### Cambiar rol

```txt
PATCH /users/{user}/role
```

Payload:

```json
{
  "role": "support_agent"
}
```

Roles válidos:

```txt
admin
support_agent
user
```

## Agentes de soporte

```txt
GET /support-agents
```

Respuesta recomendada:

```json
{
  "support_agents": [
    {
      "id": 2,
      "name": "Agente Demo",
      "email": "agente@example.com"
    }
  ]
}
```

## Importación de usuarios

### Historial

```txt
GET /users/imports
```

### Crear importación

```txt
POST /users/import
```

Payload `multipart/form-data`:

```txt
file
update_existing
default_password
```

Detalle completo en [`05-importacion-usuarios.md`](05-importacion-usuarios.md).

## Notificaciones

### Listar

```txt
GET /notifications
```

Respuesta recomendada:

```json
{
  "notifications": [
    {
      "id": "uuid",
      "title": "Ticket actualizado",
      "message": "El ticket TK-0001 cambió de estado.",
      "read_at": null,
      "created_at": "2026-06-17 10:00:00",
      "data": {}
    }
  ],
  "pagination": {},
  "unread_count": 1
}
```

El frontend también puede leer:

```txt
data.title
data.message
body
type
```

### Marcar una como leída

```txt
PATCH /notifications/{notification}/read
```

### Marcar todas como leídas

```txt
PATCH /notifications/read-all
```

## Perfil

### Actualizar perfil

```txt
PATCH /profile
```

Payload:

```json
{
  "name": "Nuevo nombre",
  "email": "nuevo@example.com"
}
```

### Cambiar contraseña

```txt
PATCH /password
```

Payload:

```json
{
  "current_password": "actual",
  "password": "nueva-password",
  "password_confirmation": "nueva-password"
}
```

## Errores de validación

Formato recomendado para errores Laravel:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password field is required."]
  }
}
```

## Códigos HTTP esperados

| Código | Uso esperado |
| --- | --- |
| `200` | Consulta o actualización exitosa. |
| `201` | Creación exitosa. |
| `204` | Eliminación sin contenido. |
| `401` | Token inválido o sesión expirada. |
| `403` | Usuario sin permisos. |
| `404` | Recurso o endpoint no encontrado. |
| `405` | Método no permitido. |
| `422` | Error de validación. |
| `500` | Error interno del servidor. |
