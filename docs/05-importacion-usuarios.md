# Importación masiva de usuarios

La importación masiva permite crear o actualizar usuarios desde un archivo CSV, TXT o XLSX. Esta función está disponible en la pantalla `/users` y está pensada para administradores.

## Acceso

Solo usuarios con rol:

```txt
admin
```

La interfaz valida:

```js
user.role === 'admin'
```

El backend también debe validar permisos para evitar accesos no autorizados por API.

## Endpoints usados

### Historial de importaciones

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

## Formatos soportados

```txt
csv
txt
xlsx
```

Tamaño máximo recomendado:

```txt
10 MB
```

Para XLSX, el backend requiere la extensión PHP:

```txt
zip
```

## Columnas principales

```txt
name,email,role,password
```

| Columna | Obligatoria | Descripción |
| --- | --- | --- |
| `name` | Sí | Nombre del usuario. |
| `email` | Sí | Correo electrónico único y válido. |
| `role` | No | Rol del usuario. Si falta, se recomienda usar `user`. |
| `password` | No | Contraseña inicial. |

## Alias aceptados

```txt
nombre -> name
correo -> email
email_address -> email
rol -> role
contrasena -> password
```

Se recomienda usar `contrasena` sin `ñ` para evitar problemas de codificación en archivos CSV.

## Roles válidos

```txt
user
support_agent
admin
```

## Ejemplo CSV

```csv
name,email,role,password
Maria Soporte,maria@example.com,support_agent,password123
Cliente Demo,cliente@example.com,user,password123
Admin Demo,admin.demo@example.com,admin,password123
```

## Plantilla descargable

La pantalla `/users` genera una plantilla CSV desde el navegador con el siguiente contenido base:

```csv
name,email,role,password
Maria Soporte,maria@example.com,support_agent,password123
Cliente Demo,cliente@example.com,user,password123
```

## Contraseña por defecto

Si una fila no incluye contraseña, el backend puede usar el campo:

```txt
default_password
```

Si tampoco se envía `default_password`, se recomienda que el backend use una contraseña temporal segura o rechace la fila según la política del sistema.

## Actualización de usuarios existentes

Campo enviado por el frontend:

```txt
update_existing
```

Comportamiento recomendado:

### Si `update_existing` está desactivado

Cuando el correo ya existe:

- La fila se omite.
- Se registra error o advertencia.
- No se modifica el usuario existente.

### Si `update_existing` está activado

Cuando el correo ya existe:

- Se actualiza nombre.
- Se actualiza rol.
- Se actualiza contraseña solo si viene en la fila o si se envía `default_password`.

## Respuesta esperada del backend

```json
{
  "message": "Users imported successfully",
  "import": {
    "id": 1,
    "original_name": "usuarios.xlsx",
    "created_count": 10,
    "updated_count": 2,
    "skipped_count": 1,
    "errors": [
      {
        "row": 4,
        "email": "bad-email",
        "errors": ["The email field must be a valid email address."]
      }
    ],
    "created_at": "2026-06-17 10:00:00"
  }
}
```

## UI frontend

El panel de importación incluye:

- Selector de archivo.
- Checkbox para actualizar usuarios existentes.
- Campo de contraseña por defecto.
- Botón para importar.
- Botón para descargar plantilla CSV.
- Historial con creados, actualizados, omitidos y errores.

## Validaciones recomendadas en backend

- Validar extensión del archivo.
- Validar tamaño máximo.
- Validar correo único o actualizable.
- Validar rol contra lista permitida.
- Validar contraseña mínima.
- Registrar errores por fila sin detener toda la importación.
- Guardar historial de importación.

## Errores frecuentes

### El archivo XLSX no se procesa

Posible causa:

```txt
La extensión PHP zip no está habilitada.
```

Solución:

- Habilitar `zip` en PHP.
- Reiniciar el servidor.
- Probar nuevamente.

### Los nombres de columnas no se reconocen

Soluciones:

- Usar columnas en minúscula.
- Usar `name,email,role,password`.
- Evitar tildes y caracteres especiales en los encabezados.

### Usuarios existentes aparecen como omitidos

Causa probable:

```txt
update_existing está desactivado.
```

Activa la opción “actualizar existentes” antes de importar.
