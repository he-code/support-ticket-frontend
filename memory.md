# memory.md — Registro de trabajo entre sesiones

**Plan maestro:** `docs/superpowers/plans/2026-10-06-rediseno-publico-dark-only-y-correcciones.md` (34 tasks + catálogo de 36 bugs)
**Ledger interno:** `.superpowers/sdd/2026-10-06-rediseno-publico-dark-only-y-correcciones/progress.md`

## Estado de git (2026-10-07)

- WIP previo commiteado en `main` (9436e64).
- Rama `fix/bugs-criticos-y-alto` (desde main): Tasks 1-9, commits dbbb60b..0efe72f.
- Rama `feature/identidad-dark-only` (apilada en fix): Task 10, commit HEAD.
- Ambas pusheadas a origin. NO pushear `main` sin confirmación.

## Tasks completadas (1-10)

1. `lucide-react` declarado en package.json (era extraneous, rompía installs limpios).
2. Lint a cero: imports muertos (PublicLayout, ToastContext) + setState-en-efecto removido (DashboardLayout; cierre del drawer vía onClick existente).
3. `client.js`: axios SIEMPRE se instancia (guard si falta `VITE_API_URL`); timeout 15s global, 60s en subidas FormData (adjuntos, import CSV).
4. **Paginación rota arreglada** (doble unwrap perdía `meta`): nuevo `getEnvelope` en `request.js`; `paginationFromPayload` lee meta antes de desenvolver; `listTickets` usa sobre; `totalPages` usa `meta.per_page`. Tests RED→GREEN.
5. `useAsync`: `loading=true` y `error=null` al inicio de cada fetch (refetch con deps muestra skeleton y limpia banners). Ruling: disable puntual de `set-state-in-effect` (patrón fetch estándar).
6. TicketDetail: selects de estado/agente se **sincronizan con los datos del ticket** (patrón ajuste-en-render de React); antes "Guardar asignación" sin tocar **desasignaba al agente**. `Promise.allSettled` para comentarios/adjuntos (fallo degrada, ticket visible). Guard `!status` en botón de estado (asignar vacío es legítimo). Adjuntos sin URL ya no renderizan `href="#"`.
7. Dashboard: `data.error`/`data.notice` se renderizan (antes el banner era inalcanzable); "Total tickets" sin datos muestra "—" (antes inventaba ≤5).
8. Profile: `changePassword` pasa por `execute` (antes fallaba en SILENCIO); validación de confirmación; `updateUser` inmediato tras éxito del perfil.
9. AuthContext: `updateUser(falsy)` hace `removeItem` (antes guardaba `"undefined"` y rompía la sesión al recargar); login SIN usuario de la API **falla** (antes fabricaba `role:'user'`). Tests nuevos 3/3.
10. `index.css` dark-only: paleta nueva (bg `#08080c`, surface `#101018`, accent `#0598fb`, accent-2 `#a855f7`); eliminado `@custom-variant dark` y `:root` claro; utilidades `.bg-brand-gradient`, `.text-brand-gradient`, `.hairline-gradient`.

**Verificación:** suite 110/110 verde, lint 0 errores, build OK tras cada task.

## Pendiente (Tasks 11-34, ver plan)

- Fase 2 restante: 11 (index.html sin `class="dark"` + Space Grotesk), 12 (SupportUi botones/LogoMark, quitar Sun/Moon), 13 (favicon violeta→azul **PENDING CONFIRMAR**), 14-16 (timers/a11y Toast, TopProgress, ConfirmModal).
- Fase 3: 17-21 vistas públicas (PublicLayout, TicketMock firma, Landing, Login split, 404).
- Fase 4: 22-33 (deep links, 401 robusto, per_page en listas, createTicket adjuntos, CategoriesPage refresco, fallback GET/POST, PaginationBar a11y, UsersPage lote, layout sin búsqueda decorativa, borrar `useKeyboardShortcuts.js` **PENDING CONFIRMAR**, vercel.json /api, README+ortografía global).
- Fase 5: 34 verificación integral + revisión de rama completa.

## Pendientes del usuario

- Favicon: recolorear violeta `#863bff` → azul `#0598fb`/degradado (Task 13). Asumido SÍ, sin confirmar.
- `npm audit`: axios 1.17 con vulnerabilidades HIGH (varios GHSA) + vitest moderate. Upgrade de axios = cambio aislado aparte.
- Borrar hook muerto `useKeyboardShortcuts.js` (Task 31) — sin confirmar.
- `main` NO pusheado al remoto.

## Convenciones

- Commits: `fix:`/`feat:`/`refactor:`, en español sin acentos (evitar problemas de quoting en PowerShell — NO usar comillas dobles dentro del mensaje).
- TDD en fixes de lógica (tests en `__tests__`, estilo Vitest + RTL del repo).
- Español de la UI aún SIN acentos; el pase global de ortografía es la Task 33.
