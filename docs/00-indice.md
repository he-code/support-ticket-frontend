# Índice de documentación

Esta carpeta reúne la documentación técnica y funcional del frontend de tickets de soporte.

## Lectura recomendada

1. [`01-instalacion.md`](01-instalacion.md): prepara el entorno local y conecta el frontend con el backend.
2. [`02-arquitectura-frontend.md`](02-arquitectura-frontend.md): entiende cómo está organizado el código.
3. [`03-contrato-api.md`](03-contrato-api.md): revisa qué endpoints espera consumir el frontend.
4. [`04-guia-de-uso.md`](04-guia-de-uso.md): conoce el flujo funcional de cada pantalla.
5. [`05-importacion-usuarios.md`](05-importacion-usuarios.md): revisa el formato de importación masiva.
6. [`06-despliegue.md`](06-despliegue.md): publica el frontend en Vercel, Netlify o servidor estático.
7. [`07-mantenimiento.md`](07-mantenimiento.md): aplica convenciones para extender el proyecto.
8. [`08-solucion-problemas.md`](08-solucion-problemas.md): consulta errores comunes y soluciones.
9. [`09-checklist-repositorio.md`](09-checklist-repositorio.md): limpia el repo antes de subirlo a GitHub.

## Resumen del sistema

`support-ticket-frontend` es una aplicación React para mesa de soporte. Consume una API Laravel con autenticación Bearer/Sanctum y organiza la interfaz por roles: administrador, agente de soporte y usuario final.

## Módulos documentados

- Autenticación.
- Dashboard.
- Tickets.
- Comentarios.
- Adjuntos.
- Categorías.
- Usuarios.
- Importación masiva.
- Notificaciones.
- Perfil.
- Despliegue.
- Mantenimiento.
