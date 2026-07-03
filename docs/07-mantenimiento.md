# Mantenimiento y mejoras

Este documento define convenciones para mantener el proyecto ordenado y facilitar nuevas funcionalidades.

## Convenciones generales

- Las llamadas HTTP viven en `src/api/support.js`.
- Las rutas del backend viven en `src/config/apiRoutes.js`.
- Los helpers de dominio viven en `src/lib/support.js`.
- Componentes reutilizables simples viven en `src/components/SupportUi.jsx`.
- Las páginas no deben llamar Axios directamente.
- La UI puede ocultar acciones por rol, pero la seguridad debe implementarse en backend.

## Agregar un endpoint nuevo

1. Agrega la ruta en `src/config/apiRoutes.js`.
2. Crea una función en `src/api/support.js`.
3. Usa esa función desde la página o componente.
4. Normaliza la respuesta con `payloadFromResponse` o `collectionFromPayload` si aplica.
5. Ejecuta validaciones:

```bash
npm run lint
npm run build
```

Ejemplo:

```js
// src/config/apiRoutes.js
export const apiRoutes = {
  reports: '/reports',
}
```

```js
// src/api/support.js
export async function listReports(params = {}) {
  return payloadFromResponse(await api.get(apiRoutes.reports, { params }))
}
```

## Agregar una pantalla nueva

1. Crear archivo en `src/pages`.
2. Agregar la ruta en `src/App.jsx`.
3. Agregar navegación en `src/layouts/DashboardLayout.jsx` si corresponde.
4. Definir roles permitidos.
5. Crear funciones API necesarias en `src/api/support.js`.
6. Ejecutar `npm run lint` y `npm run build`.

## Agregar una opción al menú

Editar `navigation` en:

```txt
src/layouts/DashboardLayout.jsx
```

Ejemplo:

```js
{
  name: 'Reportes',
  path: '/reports',
  icon: 'dashboard',
  roles: ['admin'],
}
```

## Agregar un rol nuevo

1. Agregar el rol en `roleOptions` dentro de `src/lib/support.js`.
2. Actualizar navegación en `DashboardLayout.jsx`.
3. Ajustar pantallas que dependan de roles.
4. Ajustar políticas en backend.
5. Probar con usuario real de ese rol.

## Agregar un estado de ticket nuevo

1. Agregar el estado en `statusOptions` dentro de `src/lib/support.js`.
2. Verificar que el backend acepte ese estado.
3. Revisar filtros de tickets.
4. Revisar cambio de estado en detalle de ticket.
5. Actualizar `docs/03-contrato-api.md`.

## Agregar una prioridad nueva

1. Agregar la prioridad en `priorityOptions` dentro de `src/lib/support.js`.
2. Verificar validación del backend.
3. Revisar formulario de creación.
4. Revisar filtros.
5. Actualizar contrato API.

## Manejo de errores

Formato común de Laravel:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

Recomendación:

- Mostrar `message` como error general.
- Mostrar errores por campo en formularios críticos.
- Mantener mensajes claros para usuarios finales.
- Registrar en consola solo durante desarrollo.

## Respuestas flexibles del backend

El frontend ya intenta normalizar distintas estructuras de respuesta. Aun así, lo ideal es que el backend mantenga un contrato consistente.

Formato recomendado para objetos:

```json
{
  "data": {
    "id": 1,
    "name": "Ejemplo"
  }
}
```

Formato recomendado para colecciones:

```json
{
  "data": {
    "tickets": [],
    "pagination": {}
  }
}
```

## Seguridad

Recomendaciones:

- No confiar únicamente en el rol guardado en `localStorage`.
- Validar permisos en cada endpoint del backend.
- Evitar guardar información sensible en localStorage.
- No subir `.env` al repositorio.
- Usar HTTPS en producción.
- Configurar CORS solo para dominios necesarios.

## Calidad de código

Antes de crear un commit:

```bash
npm run lint
npm run build
```

Revisa también:

- Que no haya `console.log` innecesarios.
- Que no se hayan subido archivos generados.
- Que la documentación se actualice si cambió el contrato API.
- Que `.env.example` contenga variables nuevas.

## Pruebas recomendadas

El proyecto aún no incluye pruebas automatizadas. Se recomienda agregar:

- Vitest para pruebas unitarias.
- React Testing Library para componentes.
- Playwright para pruebas E2E.

Flujos prioritarios para pruebas E2E:

1. Login exitoso.
2. Login fallido.
3. Crear ticket.
4. Filtrar tickets.
5. Abrir detalle.
6. Comentar ticket.
7. Subir adjunto.
8. Cambiar estado.
9. Importar usuarios con admin.
10. Logout.

## Mejoras recomendadas

### Corto plazo

- Mostrar paginación real en tickets.
- Mostrar paginación real en usuarios.
- Mejorar errores por campo en formularios.
- Agregar confirmación visual al subir adjuntos.
- Evitar crear usuario vía `/register` desde admin si el backend puede tener endpoint dedicado.

### Mediano plazo

- Pantalla para canales de ticket.
- Pantalla para equipos de soporte.
- Pantalla para etiquetas.
- Historial de actividad del ticket.
- Notas internas para staff.
- Filtros avanzados guardados.
- Exportes de reportes.

### Largo plazo

- Base de conocimiento.
- Encuestas de satisfacción.
- Reglas de automatización.
- SLA configurable.
- Horarios laborales y feriados.
- Campos personalizados.
- Panel de métricas avanzado.

## Riesgos conocidos

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| La creación individual de usuarios usa `/register`. | Puede chocar con reglas públicas de registro. | Crear endpoint admin dedicado para usuarios. |
| El cambio de rol depende de `/users/{user}/role`. | No permite edición completa de usuario. | Agregar endpoint `PATCH /users/{user}`. |
| Los adjuntos se suben después de crear el ticket. | Si falla un adjunto, el ticket queda creado. | Permitir reintento y mostrar error específico. |
| XLSX depende de PHP `zip`. | Importación XLSX puede fallar. | Documentar requisito y validar en backend. |
| El rol se lee desde `localStorage`. | Puede manipularse en cliente. | Autorizar siempre en backend. |

## Checklist de mantenimiento por cambio

Antes de cerrar una mejora, confirma:

- [ ] El código compila.
- [ ] ESLint pasa sin errores.
- [ ] El flujo fue probado manualmente.
- [ ] Las variables nuevas están en `.env.example`.
- [ ] El contrato API fue actualizado si cambió un endpoint.
- [ ] La guía de uso fue actualizada si cambió una pantalla.
- [ ] No se subieron archivos generados o sensibles.
