# memory.md — Registro de trabajo entre sesiones

**Plan maestro:** `docs/superpowers/plans/2026-10-06-rediseno-publico-dark-only-y-correcciones.md` (34 tasks + catálogo de 36 bugs, Anexo A/B)
**Ledger interno:** `.superpowers/sdd/2026-10-06-rediseno-publico-dark-only-y-correcciones/progress.md`

## Estado git (2026-10-07)

- WIP previo commiteado en `main` (9436e64). `main` NO pusheado (decisión pendiente del usuario).
- Ramas pusheadas a origin: `fix/bugs-criticos-y-alto` (Tasks 1-9) → `feature/identidad-dark-only` (Tasks 10-21) → `fix/bugs-restantes` (Tasks 22-34, apilada en feature).
- Orden git: main → fix/bugs-criticos-y-alto → feature/identidad-dark-only → fix/bugs-restantes.

## Tasks completadas (1-34, TODAS)

**Fixes (rama fix/bugs-criticos-y-alto):** 1 lucide-react pkg, 2 lint, 3 client (guard env/timeout), 4 paginación (meta preservada, getEnvelope), 5 useAsync (loading+error en refetch), 6 TicketDetail (selects sincronizados, Promise.allSettled sub-recursos), 7 Dashboard (errores visibles, sin total inventado), 8 Profile (contraseña por execute, confirmación), 9 AuthContext (sin usuario fabricado, updateUser guard).
**Identidad + público (rama feature/identidad-dark-only):** 10 paleta dark-only, 11 index.html (sin .dark, Space Grotesk, theme-color), 12 SupportUi (botones unificados, LogoMark, sin Sun/Moon), 13 favicon recolor (azul→violeta), 14 ToastContext timers+aria, 15 TopProgressBar timers, 16 ConfirmModal focus trap (TDD, foco en Cancelar), 17 PublicLayout (nav/footer con marca), 18 TicketMock (TDD, pieza visual firma), 19 Landing (hero split, hairlines, CTAs, acentos), 20 Login (split-screen, sin botón muerto), 21 404 (TicketMock #TKT-404).
**Fixes restantes (rama fix/bugs-restantes):** 22 deep links (state.from), 23 interceptor 401 robusto, 24 per_page en listas, 25 createTicket adjuntos no bloqueantes (no duplica), 26 CategoriesPage refresco con error, 27 sin fallback en PATCH/DELETE, 28 PaginationBar clamp+aria (TDD), 29 UsersPage (fecha, rol, autodemoción bloqueada, confirmación de roles), 30 DashboardLayout (sin búsqueda decorativa + acentos), 31 hook muerto useKeyboardShortcuts eliminado, 32 vercel.json /api 404, 33 ortografía 58 reemplazos + README dark-only, 34 verificación integral.
**Extra autorizado:** axios 1.17→1.20 + `npm audit fix` — **0 vulnerabilidades**.

## Verificación

- Lint: 0 errores. Tests: **122/122**. Build: exit 0.
- Verificación real en navegador (dev server): Landing/Login/404 con bg `#08080c`, degradados, Space Grotesk, TicketMock, sin errores de consola, responsive colapsa correcto.
- Nota: hubo 1 fallo flaky transitorio en formatters.test.js en suite lenta; pasa aislado y en re-ejecución completa.

## Rulings tomados (decisiones del implementador)

- `useAsync`: disable puntual de eslint `set-state-in-effect` — la bandera de inicio de fetch no es derivable del render (patrón estándar data fetching).
- TicketDetail: guard de vacío solo en botón de ESTADO; asignación vacía = desasignar legítimo.
- ConfirmModal: prop `icon` añadido (default 'trash'); UsersPage usa 'shield' en cambio de rol.
- Favicon: hints `color(display-p3 ...)` eliminados para que el hex nuevo gobierne.
- Revisor externo subagent no pudo ejecutarse (modelos pro/flagship no disponibles: EOL/404). Se hizo pase propio contra los 5 Review Focus del plan. **El usuario decide si eso basta para merge o pide otra revisión.**

## Pendientes del usuario (no bloquean branch)

- `main` no pusheado al remoto (decisión tuya).
- Decidir merge/PRs: orden recomendado fix/bugs-criticos-y-alto → feature/identidad-dark-only → fix/bugs-restantes, por la pila de branches.

## Convenciones para futuras sesiones

- Commits en `fix:`/`feat:`/`refactor:`, mensaje sin comillas dobles (PowerShell).
- TDD en fixes de lógica (Vitest + RTL, patrones en `src/**/__tests__`).
- Español de UI con acentos (barrido: Node script en `%TEMP%\opencode\sweep-ortografia.mjs`).
- NO re-introducir modo claro ni toggle: dark-only es identidad permanente.
