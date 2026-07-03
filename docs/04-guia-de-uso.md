# Guía de uso

Esta guía describe cómo utilizar las pantallas principales del frontend.

## 1. Inicio de sesión

Ruta:

```txt
/login
```

El usuario ingresa:

- Correo electrónico.
- Contraseña.

Si la API devuelve un token válido, el frontend:

1. Guarda el token en `localStorage`.
2. Guarda el usuario en `localStorage`.
3. Redirige a `/dashboard`.

Si el login falla, se muestra un mensaje de error.

## 2. Dashboard

Ruta:

```txt
/dashboard
```

Muestra un resumen de la mesa de soporte:

- Total de tickets.
- Tickets abiertos.
- Tickets en progreso.
- Tickets cerrados.
- Tickets recientes.

Desde esta pantalla se puede ir a:

- Listado de tickets.
- Creación de nuevo ticket.

## 3. Listado de tickets

Ruta:

```txt
/tickets
```

Permite consultar y filtrar tickets.

Funciones disponibles:

- Buscar por texto.
- Filtrar por estado.
- Filtrar por prioridad.
- Filtrar por categoría.
- Abrir el detalle de un ticket.

Estados disponibles:

| Valor técnico | Texto en interfaz |
| --- | --- |
| `open` | Abierto |
| `in_progress` | En progreso |
| `waiting_customer` | Espera cliente |
| `waiting_internal` | Espera interna |
| `resolved` | Resuelto |
| `closed` | Cerrado |
| `reopened` | Reabierto |

Prioridades disponibles:

| Valor técnico | Texto en interfaz |
| --- | --- |
| `low` | Baja |
| `medium` | Media |
| `high` | Alta |
| `urgent` | Urgente |

## 4. Crear ticket

Ruta:

```txt
/tickets/create
```

Campos del formulario:

- Asunto.
- Descripción.
- Categoría.
- Prioridad.
- Adjuntos.

Flujo actual:

1. El usuario completa el formulario.
2. El frontend envía `POST /tickets`.
3. Si la API devuelve el ticket creado, el frontend toma su ID.
4. Si hay archivos adjuntos, los sube uno por uno.
5. Al finalizar, redirige al detalle del ticket o al listado.

Formatos de adjuntos recomendados por backend:

```txt
jpg, jpeg, png, pdf, txt, doc, docx
```

## 5. Detalle de ticket

Ruta:

```txt
/tickets/:ticketId
```

Muestra:

- Código del ticket.
- Título.
- Descripción.
- Estado.
- Prioridad.
- Categoría.
- Solicitante.
- Agente asignado.
- Fecha de creación.
- Comentarios.
- Adjuntos.

Acciones disponibles según permisos del backend:

- Cambiar estado.
- Asignar o desasignar agente.
- Agregar comentario.
- Subir adjunto.

## 6. Comentarios

En el detalle del ticket se puede agregar un comentario.

Payload enviado:

```json
{
  "body": "Texto del comentario"
}
```

Recomendaciones:

- Escribir respuestas claras y breves.
- Registrar avances importantes del caso.
- Evitar datos sensibles innecesarios.

## 7. Adjuntos

Los adjuntos se suben desde el detalle o durante la creación del ticket.

La subida usa `multipart/form-data` con el campo:

```txt
file
```

Si falla la subida de un adjunto durante la creación, el ticket puede quedar creado sin ese archivo. En ese caso, el usuario puede abrir el ticket y volver a intentar subir el archivo.

## 8. Categorías

Ruta:

```txt
/categories
```

Visible para:

- Administrador.
- Agente de soporte.

Funciones:

- Listar categorías.
- Crear categoría.
- Activar o desactivar categoría.
- Eliminar categoría.

Nota: aunque la pantalla sea visible para `support_agent`, el backend puede restringir crear, editar o eliminar solo a `admin`.

## 9. Usuarios

Ruta:

```txt
/users
```

Visible solo para:

```txt
admin
```

Funciones:

- Listar usuarios.
- Crear usuario individual.
- Cambiar rol.
- Importar usuarios en lote.
- Ver historial de importaciones.

Roles disponibles:

| Valor técnico | Texto en interfaz |
| --- | --- |
| `admin` | Administrador |
| `support_agent` | Agente |
| `user` | Usuario |

## 10. Importación masiva de usuarios

Disponible en la pantalla `/users` para administradores.

Permite cargar archivos:

```txt
csv, txt, xlsx
```

Columnas principales:

```txt
name,email,role,password
```

La pantalla incluye:

- Selector de archivo.
- Opción para actualizar usuarios existentes.
- Contraseña por defecto.
- Botón para descargar plantilla CSV.
- Historial de importaciones.

Detalle completo en [`05-importacion-usuarios.md`](05-importacion-usuarios.md).

## 11. Notificaciones

Ruta:

```txt
/notifications
```

Funciones:

- Listar notificaciones.
- Distinguir leídas y no leídas.
- Marcar una notificación como leída.
- Marcar todas como leídas.

## 12. Perfil

Ruta:

```txt
/profile
```

Permite:

- Actualizar nombre.
- Actualizar correo electrónico.
- Cambiar contraseña.

Para cambiar contraseña se envía:

- Contraseña actual.
- Nueva contraseña.
- Confirmación de nueva contraseña.

## 13. Cierre de sesión

El botón de cierre de sesión está disponible en:

- Sidebar de escritorio.
- Header móvil.

Flujo:

1. El frontend llama `POST /logout`.
2. Limpia `token` y `user` del `localStorage`.
3. Redirige a `/login`.

Aunque la API falle, la sesión local se limpia.

## 14. Recomendaciones de uso por rol

### Administrador

- Crear categorías antes de que los usuarios registren tickets.
- Crear o importar agentes de soporte.
- Revisar usuarios y roles.
- Monitorear tickets sin asignar.

### Agente de soporte

- Revisar tickets abiertos.
- Cambiar estado según avance.
- Asignarse o revisar asignaciones.
- Comentar avances.
- Adjuntar evidencia cuando sea necesario.

### Usuario final

- Crear tickets con descripción clara.
- Adjuntar capturas o documentos relevantes.
- Revisar comentarios del agente.
- Consultar cambios de estado.
