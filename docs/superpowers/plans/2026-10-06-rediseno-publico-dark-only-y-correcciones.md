# Rediseño Público Dark-Only y Corrección de Bugs — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corregir los bugs verificados del sistema de tickets, eliminar todo el modo claro (dark-only), aplicar la nueva identidad cromática (#0598fb / #a855f7 / #08080c) y reestructurar las vistas públicas (Landing, Login, 404) con un diseño profesional.

**Architecture:** SPA React 19 + Vite 8 + Tailwind 4 + React Router 7, sin cambios de estructura de carpetas. Los tokens de color viven en `src/index.css` (`@theme`), la UI compartida en `src/components/SupportUi.jsx`. Las correcciones de datos se hacen en la capa API/hooks (`request.js`, `normalizers.js`, `useAsync.js`) para que beneficien a todas las páginas.

**Tech Stack:** React 19, Vite 8, Tailwind CSS 4, axios, lucide-react (a añadir a package.json), Vitest + React Testing Library.

**Spec:** `docs/superpowers/specs/2025-07-30-rediseno-visual-ux-design.md` (spec previo, implementado en el working tree) + sección "Diseño" de este plan, que lo extiende y sustituye en: paleta, tipografía, dark-only y vistas públicas.

## Global Constraints

- Dark-only: sin modo claro, sin toggle, sin `@custom-variant dark`, sin clase `.dark` en `index.html`.
- Paleta exacta: acento `#0598fb`, secundario degradados `#a855f7`, base `#08080c`.
- Degradado de marca: `linear-gradient(135deg, #0598fb 0%, #a855f7 100%)`.
- CTA primario: fondo degradado con texto `#08080c` (contraste AA ≥ 5:1 en todo el recorrido del degradado).
- Texto en español CON acentos y ñ en toda la UI y README ("Gestión", "Categorías", "Contraseña", "sesión").
- `npm run lint` en 0 errores y los 101 tests existentes en verde tras cada tarea; añadir tests nuevos para fixes de lógica.
- Contraste AA mínimo: texto normal ≥ 4.5:1 sobre `#08080c`; `#0598fb` y `#8f94a8` sobre `#08080c` cumplen (6.5:1); prohibido texto blanco sobre `#a855f7`/`#0598fb` en tamaños < 18.66px bold.
- `prefers-reduced-motion` se respeta (ya global en CSS, mantenerlo).
- Commits convencionales (`fix:`, `feat:`, `refactor:`) con `git add` de rutas explícitas.

## Review Focus

1. **Sobre Laravel estándar `{data:[...], meta:{...}}`** — la paginación debe mostrar `total` real y páginas navegables; probar con meta `{total: 30, per_page: 15}`.
2. **Refetch con error previo** — tras un fallo, una recarga exitosa debe limpiar el banner de error.
3. **TicketDetail con ticket ya asignado** — el select de agente debe mostrar la asignación actual y "Guardar" sin tocar nada NO debe desasignar.
4. **Login con credenciales inválidas (401)** — no debe redirigir en bucle ni duplicar redirects; el mensaje de error debe verse.
5. **HTML servido como JSON** — si la API responde HTML (rewrite de Vercel), el usuario debe ver un error claro, no un crash silencioso.

## Precondition (decisión del usuario)

El working tree tiene 21 archivos modificados sin commit (~1000 líneas, el rediseño de la spec previa). **Antes de ejecutar el plan, commitear el estado actual** en uno o varios commits (`git add -A && git commit -m "feat: aplicar rediseño visual previo"`) para que cada tarea del plan tenga un diff limpio y reversible.

## Diseño (extiende la spec previa)

### Tokens de color (dark-only, `@theme` en `src/index.css`)

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-bg` | `#08080c` | Fondo principal (base casi negra) |
| `--color-surface` | `#101018` | Cards, sidebar, paneles |
| `--color-surface-hover` | `#1a1a26` | Hover de elementos |
| `--color-border` | `#20202c` | Bordes y separadores |
| `--color-text` | `#f4f6fb` | Texto primario |
| `--color-muted` | `#8f94a8` | Texto secundario |
| `--color-accent` | `#0598fb` | Acento protagonista (azul celeste) |
| `--color-accent-2` | `#a855f7` | Secundario, solo en degradados |
| `--color-accent-soft` | `#0598fb14` | Glow/glass del acento |
| `--color-success` / `warning` / `danger` / `info` | `#10b981` / `#f59e0b` / `#ef4444` / `#06b6d4` | Semánticos (sin cambio) |

Eliminar: `:root` con valores claros, `:root.dark`, `@custom-variant dark`, y la clase `class="dark"` de `index.html`. `:root` queda directamente oscuro (bg `#08080c`, color `#f4f6fb`).

Utilidades nuevas en `index.css`: `.bg-brand-gradient` (degradado 135° #0598fb→#a855f7), `.text-brand-gradient` (texto con `background-clip: text`), `.hairline-gradient` (regla de 1px con el degradado, para separadores de sección).

### Tipografía

| Rol | Fuente | Pesos | Uso |
|-----|--------|-------|-----|
| Display | **Space Grotesk** (nueva, Google Fonts) | 500/700 | Hero h1, títulos de sección, cifras grandes |
| Body/UI | Inter (ya cargada) | 400/500/600/700 | Todo lo demás |
| Códigos | JetBrains Mono (ya cargada) | 400/500 | Códigos de ticket, eyebrows de sección en mayúsculas |

Eyebrows de sección en mono: `PLATAFORMA`, `CAPACIDADES`, `ACCESO` — uppercase, tracking-widest, color accent, sin numeración (las features no son una secuencia real).

### Firma visual: la tarjeta de ticket perforada (TicketMock)

El elemento memorable es una **maqueta realista de un ticket del propio producto**: código `#TKT-2481` en mono, badge de estado, prioridad, reloj de SLA, avatares de agente y comentarios, con **bordes perforados** (muescas circulares recortadas a los lados, como ticket físico). Flota levemente rotada (-2°) sobre una aurora azul→violeta. Aparece en el hero de la Landing y reutilizada (variante "NO ENCONTRADO") en la página 404. Es el producto mostrándose a sí mismo — no decoración genérica.

### Layouts

**Landing (hero split):**
```
┌────────────────────────────────────────────────────────┐
│ ◆ Support Tickets              [Acceder al panel ▸]     │  nav fija, blur progresivo
├────────────────────────────────────────────────────────┤
│  [PLATAFORMA DE SOPORTE]   ╔═════════════════════╗      │
│                            ║  #TKT-2481  [OPEN]  ║      │
│  Mesa de soporte          ║  ▓▓▓▓▓▓▓▓▓▓ ▓▓▓▓▓▓  ║      │  TicketMock perforado,
│  que no se queda atrás    ║  Alta · SLA 04:12    ║      │  rotado -2°, aurora detrás
│                            ╚═════════════════════╝      │
│  párrafo de apoyo                                      │
│  [Entrar al panel]  [Ver capacidades ↓]                   │
├──────────────────────── hairline-gradient ─────────────┤
│  [CAPACIDADES]                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│  │ Ticket ▤ │ │ SLA ⏱   │ │ Equipo ◎ │  3 cards       │
│  └──────────┘ └──────────┘ └──────────┘                │
├──────────────────────── hairline-gradient ─────────────┤
│  [ACCESO]  CTA final centrado sobre aurora suave        │
├────────────────────────────────────────────────────────┤
│  ◆ logo · Inicio · Acceder · © 2026                    │  footer de una fila
└────────────────────────────────────────────────────────┘
```

**Login (split-screen):**
```
┌──────────────────┬─────────────────────────────┐
│                  │                             │
│   aurora         │   Iniciar sesión            │
│   azul-violeta   │   Accede al panel            │
│                  │   ┌─────────────────────┐   │
│   ◆ Support      │   │ ✉ correo            │   │
│   Tickets        │   │ 🔒 contraseña       │   │
│                  │   │ [✓] Recordar        │   │
│   • colas        │   │ [ Entrar al panel ] │   │  CTA degradado
│   • SLA          │   └─────────────────────┘   │
│   • informes     │                             │
└──────────────────┴─────────────────────────────┘
   oculto en <lg      panel derecho siempre
```

**404:** TicketMock variante con badge "NO ENCONTRADO" + `#TKT-404`, titular "Página no encontrada", CTA "Volver al inicio".

### Copy

Español con acentos, sentence case, verbos activos. Botón que dice lo que hace. Sin botones muertos: se elimina "¿Olvidaste tu contraseña?" (no existe endpoint de reset en el backend, ver `apiRoutes.js`). Footer sin columnas de enlaces falsos ("Documentación", "Estado del sistema" eran `<span>` muertos).

### Logo mark

Reemplazar el monograma de texto "ST" por un tile con el degradado de marca y el glifo del ticket perforado (el mismo path del favicon recoloreado). Componente `LogoMark` reutilizable en nav, login, footer y sidebar.

## Fase 0 — Higiene de build

### Task 1: Añadir `lucide-react` a las dependencias

**Files:**
- Modify: `package.json`, `package-lock.json`

**Interfaces:**
- Produce: `lucide-react` como dependencia real (`npm ls lucide-react` la lista sin "extraneous"); `SupportUi.jsx` sigue importando igual.

- [ ] **Step 1:** `npm install lucide-react` (instala y lo agrega a `dependencies`).
- [ ] **Step 2:** Verificar: `npm ls lucide-react` → `lucide-react@x.y.z` sin "extraneous".
- [ ] **Step 3:** Verificar build: `npm run build` → exitoso.
- [ ] **Step 4:** Commit: `git add package.json package-lock.json` → `git commit -m "fix: declarar lucide-react como dependencia (era extraneous y rompia installs limpios)"`.

### Task 2: Lint a cero

**Files:**
- Modify: `src/components/PublicLayout.jsx:3` (quitar import `Icon` no usado), `src/context/ToastContext.jsx:3` (ídem), `src/layouts/DashboardLayout.jsx:52-54` (eliminar `useEffect` que hace `setSidebarOpen(false)`).

**Interfaces:**
- Produce: `npm run lint` sin errores. El cierre del drawer móvil queda cubierto por los `onClick` existentes en cada NavLink del drawer y en el overlay.

- [ ] **Step 1:** Eliminar los imports muertos de `Icon` en `PublicLayout.jsx` y `ToastContext.jsx`.
- [ ] **Step 2:** En `DashboardLayout.jsx`, borrar el efecto `useEffect(() => { setSidebarOpen(false) }, [location.pathname])` (y el import de `useLocation` si queda sin uso). Verificar que los NavLinks del drawer móvil ya tienen `onClick={() => setSidebarOpen(false)}` — si falta en alguno, añadirlo.
- [ ] **Step 3:** Verificar: `npm run lint` → 0 problemas.
- [ ] **Step 4:** Commit: `git add src/components/PublicLayout.jsx src/context/ToastContext.jsx src/layouts/DashboardLayout.jsx` → `git commit -m "fix: corregir errores de lint (imports muertos y setState en efecto)"`.

## Fase 1 — Bugs de datos y lógica

### Task 3: `client.js` — guard de config y timeouts de subida

**Files:**
- Modify: `src/api/client.js:3-14,8`

**Interfaces:**
- Produce: `api` nunca es `null` (crash claro si falta env, no `TypeError` críptico). `request.post` con `FormData` usa timeout 60s.

- [ ] **Step 1:** En `client.js`, sustituir el ternario que deja `api = null` por: `axios.create` SIEMPRE con `baseURL: (apiBaseUrl ?? '').replace(...)`, y debajo un check `if (!apiBaseUrl) console.warn('VITE_API_URL no definida...')` — la app arranca y falla cada petición con mensaje axios claro en vez de crash total.
- [ ] **Step 2:** Cambiar `timeout: 10000` a `timeout: 15000` global; en `api/support.js` añadir `config` con `timeout: 60000` a `uploadTicketAttachment` e `importUsers` (los dos `FormData`).
- [ ] **Step 3:** Verificar: `npm test` → 12 tests de `request.test.js` en verde.
- [ ] **Step 4:** Commit: `git add src/api/client.js src/api/support.js` → `git commit -m "fix: evitar api null sin VITE_API_URL y timeout largo para subidas"`.

### Task 4: Paginación — preservar `meta` (doble unwrap) [TDD]

**Files:**
- Modify: `src/api/request.js` (añadir `getEnvelope`), `src/lib/normalizers.js:30-34`, `src/api/support.js:9-11` (`listTickets`), `src/pages/TicketsPage.jsx:49-50`
- Test: `src/lib/__tests__/normalizers.test.js`, `src/api/__tests__/request.test.js`

**Interfaces:**
- Produce: `getEnvelope(url, config)` en `request.js` → devuelve `response.data` (el sobre `{data:[...], meta:{...}}` sin desenvolver). `paginationFromPayload(envelope)` → `{ items, meta }` con meta real.
- Consumes: `paginationFromPayload` firma igual; `collectionFromPayload` sin cambios (ya tolera sobre y array).

- [ ] **Step 1: Failing test** en `normalizers.test.js`:
```js
it('preserva meta del sobre Laravel', () => {
  const { items, meta } = paginationFromPayload({ data: [{ id: 1 }, { id: 2 }], meta: { total: 30, per_page: 15 } })
  expect(items).toHaveLength(2)
  expect(meta?.total).toBe(30)
})
```
- [ ] **Step 2:** `npx vitest run src/lib/__tests__/normalizers.test.js` → FAIL (meta null).
- [ ] **Step 3:** En `normalizers.js`, `paginationFromPayload` lee meta ANTES de desenvolver: `const meta = payload?.meta ?? payload?.data?.meta ?? null; return { items: collectionFromPayload(payload), meta }`. En `request.js` añadir `getEnvelope` (exportado). En `support.js`, `listTickets` usa `req.getEnvelope`. En `TicketsPage.jsx`, `totalPages = Math.ceil(total / (paged?.meta?.per_page ?? 15))`.
- [ ] **Step 4:** Test en `request.test.js`: `getEnvelope` devuelve `response.data` completo cuando el mock responde `{ data: { data: [...], meta: {...} } }`.
- [ ] **Step 5:** `npm test` → verde. `npm run lint` → 0.
- [ ] **Step 6:** Commit: `git add src/api/request.js src/lib/normalizers.js src/api/support.js src/pages/TicketsPage.jsx src/lib/__tests__/normalizers.test.js src/api/__tests__/request.test.js` → `git commit -m "fix: paginación rota por doble unwrap — preservar meta del backend"`.

### Task 5: `useAsync` — loading y error en refetch [TDD]

**Files:**
- Modify: `src/hooks/useAsync.js:19-36`
- Test: `src/hooks/__tests__/useAsync.test.js`

**Interfaces:**
- Produce: mismo contrato `{ data, loading, error, setData, reload }`. Al cambiar `deps` o recargar: `loading=true` inmediato y `error=null` (data previa se conserva; las páginas ya pintan skeleton con `loading ? ...`).

- [ ] **Step 1: Failing tests** en `useAsync.test.js`: (a) al cambiar deps, `loading` es `true` antes de resolver; (b) tras un fallo, una ejecución exitosa deja `error` en `null`.
- [ ] **Step 2:** `npx vitest run src/hooks/__tests__/useAsync.test.js` → FAIL.
- [ ] **Step 3:** Al inicio del cuerpo del efecto: `setError(null); setLoading(true)` (antes de invocar `fnRef.current()`).
- [ ] **Step 4:** `npm test` → verde (los 9 tests previos de useAsync + los nuevos).
- [ ] **Step 5:** Commit: `git add src/hooks/useAsync.js src/hooks/__tests__/useAsync.test.js` → `git commit -m "fix: useAsync activa loading y limpia error en cada refetch"`.

### Task 6: TicketDetailPage — selects sincronizados y degradación de sub-recursos

**Files:**
- Modify: `src/pages/TicketDetailPage.jsx:45-46,52-67,87+`

**Interfaces:**
- Produce: el select de estado arranca con `mainData.initialStatus`; el de agente con `initialAgentId`; "Guardar" deshabilitado si el valor es `''`. Comentarios/adjuntos con `Promise.allSettled` (su fallo degrada a "Sin comentarios/adjuntos", el ticket sigue visible).

- [ ] **Step 1:** Añadir `useEffect(() => { setStatus(mainData?.initialStatus ?? ''); setAgentId(mainData?.initialAgentId ?? '') }, [mainData])`.
- [ ] **Step 2:** Sustituir `Promise.all` por `Promise.allSettled` en el `useAsync` principal; los rechazados aportan `[]`; si `getTicket` rechaza, lanzar (mantiene el banner de error existente).
- [ ] **Step 3:** Deshabilitar los botones "Guardar estado/asignación" cuando el select esté vacío; re-sincronizar tras `reloadTicket()` ya cubierto por el efecto.
- [ ] **Step 3b:** Adjuntos sin URL: renderizar el nombre como texto plano (sin `<a href="#">` que abre la app en pestaña nueva) — BUG-30.
- [ ] **Step 4:** `npm run lint` → 0; `npm test` → verde.
- [ ] **Step 5:** Commit: `git add src/pages/TicketDetailPage.jsx` → `git commit -m "fix: selects de estado/agente nunca inicializados desasignaban al guardar"`.

### Task 7: DashboardPage — errores reales, sin cifras inventadas

**Files:**
- Modify: `src/pages/DashboardPage.jsx:59-64,104-115`

- [ ] **Step 1:** Renderizar `data?.error` en el banner (el `{error && ...}` actual es inalcanzable); añadir aviso `notice` en fallo parcial de stats (`statsResult` rechazado) tipo "Estadísticas no disponibles.".
- [ ] **Step 2:** `StatCard` Total tickets: sustituir `?? recentTickets.length` por `?? '—'`.
- [ ] **Step 3:** `npm test` → verde; `npm run lint` → 0.
- [ ] **Step 4:** Commit: `git commit -m "fix: dashboard muestra errores reales y no inventa el total de tickets"` (con `git add` de la página).

### Task 8: ProfilePage — cambio de contraseña con error visible

**Files:**
- Modify: `src/pages/ProfilePage.jsx:43-69`

- [ ] **Step 1:** Validar `form.password !== form.password_confirmation` → `setError('Las contraseñas no coinciden.')` antes de enviar.
- [ ] **Step 2:** Enrutar `changePassword` por `execute(changePassword, payload)` para que su fallo setee `error` y muestre el banner (hoy el catch lo traga en silencio y el usuario cree que cambió).
- [ ] **Step 3:** `npm test` → verde; `npm run lint` → 0.
- [ ] **Step 4:** Commit: `git commit -m "fix: cambio de contraseña silencioso — error visible y validación de confirmación"`.

### Task 9: AuthContext — updateUser seguro y sin usuario fabricado

**Files:**
- Modify: `src/context/AuthContext.jsx:16-26,49-54`
- Test: `src/context/__tests__/AuthContext.test.jsx` (nuevo)

**Interfaces:**
- Produce: `updateUser(falsy)` → `localStorage.removeItem('user')` (nunca guarda `"undefined"`). `readAuthPayload` sin fallback fabricado: si la API no trae `user`, lanzar `'La API no devolvió datos de usuario.'`.

- [ ] **Step 1: Failing test:** renderizar `AuthProvider` + consumidor con `updateUser(undefined)` → espera que `localStorage.getItem('user')` sea `null` (no la cadena `"undefined"`).
- [ ] **Step 2:** Run → FAIL. Implementar el guard en `updateUser`; eliminar el fabricado en `readAuthPayload`.
- [ ] **Step 3:** `npm test` → verde; lint → 0.
- [ ] **Step 4:** Commit: `git commit -m "fix: AuthContext no persiste \"undefined\" ni fabrica usuario con rol inventado"`.

## Fase 2 — Identidad dark-only

### Task 10: `index.css` — tokens nuevos y eliminación del modo claro

**Files:**
- Modify: `src/index.css:1-33`

**Interfaces:**
- Produce: tokens de la tabla de Diseño con los nombres Tailwind existentes (`bg-bg`, `text-text`, `bg-surface`, `text-accent`, `bg-accent/15`, etc. siguen funcionando sin tocar las páginas); token nuevo `--color-accent-2` → clase `text-accent-2`/`bg-accent-2`. Utilidades `.bg-brand-gradient`, `.text-brand-gradient`, `.hairline-gradient`.

- [ ] **Step 1:** Reemplazar el bloque `@theme` con la paleta de Diseño (bg `#08080c`, surface `#101018`, surface-hover `#1a1a26`, border `#20202c`, text `#f4f6fb`, muted `#8f94a8`, accent `#0598fb`, accent-2 `#a855f7`, accent-soft `#0598fb14`; semánticos sin cambio).
- [ ] **Step 2:** Borrar `@custom-variant dark`, el bloque `:root` claro y `:root.dark`; dejar `:root { font-family: var(--font-sans); color: #f4f6fb; background: #08080c; }`.
- [ ] **Step 3:** Añadir las 3 utilidades de degradado del Diseño.
- [ ] **Step 4:** `npm run build` → exitoso; `npm test` → verde.
- [ ] **Step 5:** Commit: `git commit -m "feat: paleta dark-only con identidad azul #0598fb / violeta #a855f7 / base #08080c"`.

### Task 11: `index.html` — sin clase dark, Space Grotesk

**Files:**
- Modify: `index.html:2,9`

- [ ] **Step 1:** `<html lang="es">` SIN `class="dark"`.
- [ ] **Step 2:** Google Fonts: añadir `Space Grotesk:wght@500;700` al link existente; añadir `<meta name="theme-color" content="#08080c">`.
- [ ] **Step 3:** En `index.css`, `--font-display: 'Space Grotesk', 'Inter', sans-serif` en `@theme` (genera `font-display`).
- [ ] **Step 4:** Verificar en `npm run dev` que la app arranca oscura con fondo `#08080c` y sin flash claro. Commit: `git commit -m "feat: modo oscuro permanente y tipografía display Space Grotesk"`.

### Task 12: `SupportUi` — botones unificados, LogoMark, íconos sin Sun/Moon

**Files:**
- Modify: `src/components/SupportUi.jsx`

**Interfaces:**
- Produce: `export const buttonPrimaryClass = 'inline-flex items-center justify-center gap-2 rounded-lg bg-brand-gradient px-4 py-2 text-sm font-bold text-bg transition hover:opacity-90 active:scale-[0.98] disabled:...'`, `buttonGhostClass` (borde `border-border bg-surface text-text hover:bg-surface-hover`), `buttonDangerClass` (`bg-danger text-white hover:bg-danger/90`). `LogoMark({ size = 40, withWordmark = false })` con el tile degradado. `Icon` sin `sun`/`moon` (borrar del iconMap y del import de lucide).

- [ ] **Step 1:** Quitar `Moon`/`Sun` del import y del `iconMap`; añadir los 3 `buttonClass` y `LogoMark` según Interfaces.
- [ ] **Step 2:** Reemplazar en `SupportUi`/páginas públicas los botones primarios inline (bg-accent + text-white) por `buttonPrimaryClass` (se completa en Fase 3 al tocar cada página; aquí solo exporta).
- [ ] **Step 3:** `npm run lint` → 0; `npm test` → verde. Commit: `git commit -m "refactor: clases de botón unificadas, LogoMark y limpieza de iconos de tema"`.

### Task 13: `favicon.svg` — recolor a la identidad

**Files:**
- Modify: `public/favicon.svg`

- [ ] **Step 1:** Cambiar los fills `#863bff`/`#7e14ff` por el degradado de marca `#0598fb`→`#a855f7` (linearGradient en el svg; los destellos `#ede6ff` → `#e0f2ff`). El glifo (ticket perforado) se conserva.
- [ ] **Step 2:** Verificar en el navegador (pestaña + nav). Commit: `git commit -m "feat: favicon con la identidad azul-violeta"`.

### Task 14: `ToastContext` — timers limpios y a11y

**Files:**
- Modify: `src/context/ToastContext.jsx:22-31,49-57`
- Test: `src/context/__tests__/ToastContext.test.jsx` (existe)

- [ ] **Step 1:** Guardar timers en `useRef(new Map())`; `removeToast` hace `clearTimeout` del id; cleanup global al desmontar el provider (`useEffect` return que limpia todo el Map).
- [ ] **Step 2:** `aria-label="Cerrar notificación"` en el botón de cerrar.
- [ ] **Step 3:** `npx vitest run src/context/__tests__/ToastContext.test.jsx` → verde (7 tests; si el fake-timer test necesita ajuste por el Map, ajustarlo).
- [ ] **Step 4:** Commit: `git commit -m "fix: timers de toasts sin limpiar y botón de cierre inaccesible"`.

### Task 15: `TopProgressBar` — cleanup de timers

**Files:**
- Modify: `src/components/TopProgressBar.jsx:22-29`

- [ ] **Step 1:** Guardar ids de ambos `setTimeout` en un ref; en el cleanup del efecto, `clearTimeout` de ambos (evita la raza en navegaciones rápidas que apaga la barra durante una carga nueva).
- [ ] **Step 2:** Verificación manual: navegar rápido entre páginas, la barra nunca desaparece a mitad de una carga. `npm run lint` → 0. Commit: `git commit -m "fix: raza de timers en TopProgressBar"`.

### Task 16: `ConfirmModal` — focus trap y a11y [TDD]

**Files:**
- Modify: `src/components/ConfirmModal.jsx`
- Test: `src/components/__tests__/ConfirmModal.test.jsx` (existe)

**Interfaces:**
- Produce: foco inicial en **Cancelar**; Tab/Shift+Tab ciclan dentro del diálogo; al desmontar, el foco vuelve al `document.activeElement` previo; `role="dialog" aria-modal="true" aria-labelledby`.

- [ ] **Step 1: Failing tests:** (a) al montar, `Cancelar` tiene foco; (b) Tab desde el último botón regresa al primero.
- [ ] **Step 2:** Run → FAIL. Implementar con `onKeyDown` en el contenedor (ciclar entre los 2 botones) + `useEffect` que guarda/restaura `document.activeElement`.
- [ ] **Step 3:** `npx vitest run src/components/__tests__/ConfirmModal.test.jsx` → verde. Commit: `git commit -m "fix: ConfirmModal sin focus trap enfocaba la acción destructiva"`.

## Fase 3 — Reestructuración de vistas públicas

### Task 17: `PublicLayout` — nav con identidad y footer honesto

**Files:**
- Modify: `src/components/PublicLayout.jsx`

**Interfaces:**
- Consumes: `LogoMark`, `buttonPrimaryClass` (Task 12), utilidades de Task 10.
- Produce: layout público con nav fija (logo degradado + wordmark "Support Tickets", CTA `Acceder al panel` con `buttonPrimaryClass`), blur progresivo sobre `#08080c` (recolor del `rgba` actual a `rgba(8, 8, 12, .85)`), y footer de una sola fila: `LogoMark` + descripción corta + links reales (`Inicio` → `/`, `Acceder` → `/login`) + `© 2026 Support Tickets`. Sin columnas "Recursos".

- [ ] **Step 1:** Implementar nav y footer según Diseño (usar `LogoMark`, sin "ST" de texto).
- [ ] **Step 2:** Verificación manual en `npm run dev`: scroll → blur y borde aparecen; móvil ≥360px sin overflow. Commit: `git commit -m "feat: nav y footer públicos con la identidad de marca"`.

### Task 18: `TicketMock` — componente firma

**Files:**
- Create: `src/components/TicketMock.jsx`
- Test: `src/components/__tests__/TicketMock.test.jsx`

**Interfaces:**
- Produce: `TicketMock({ status = 'open', priority = 'alta', code = '#TKT-2481', sla = '04:12', notFound = false })` — tarjeta `bg-surface border-border rounded-xl` con muescas perforadas (dos círculos absolutos `bg-bg` a mitad de borde izquierdo/derecho), contenido: código en `font-mono`, `Badge` de estado, título de 2 líneas (skeleton bars `bg-surface-hover`), fila con prioridad · SLA con `Icon clock`, avatares con iniciales. Variante `notFound` muestra badge "NO ENCONTRADO" y code `#TKT-404`.

- [ ] **Step 1: Test:** renderiza el código y el badge; con `notFound` muestra "NO ENCONTRADO".
- [ ] **Step 2:** Run → FAIL (no existe). Implementar con Tailwind puro (muescas con `absolute h-4 w-4 rounded-full bg-bg` + offsets negativos).
- [ ] **Step 3:** Test verde. Commit: `git commit -m "feat: TicketMock — tarjeta perforada como pieza visual de marca"`.

### Task 19: `LandingPage` — hero split + capacidades + CTA final

**Files:**
- Modify: `src/pages/LandingPage.jsx`

**Interfaces:**
- Consumes: `TicketMock`, `LogoMark` (vía PublicLayout), `.hairline-gradient`, `.bg-brand-gradient`, `font-display`, `buttonPrimaryClass`, `buttonGhostClass`.

- [ ] **Step 1:** Hero split según wireframe: izquierda eyebrow mono `PLATAFORMA DE SOPORTE`, h1 en `font-display` ("Mesa de soporte que no se queda atrás."), párrafo, CTA primario + ghost "Ver capacidades" (ancla `#capacidades`); derecha `TicketMock` rotado `-rotate-2` sobre aurora radial (`bg-[radial-gradient(...)]` con `--color-accent` y `--color-accent-2`).
- [ ] **Step 2:** Sección capacidades: eyebrow `CAPACIDADES`, 3 cards (`Panel`, `SLA y prioridades`, `Equipo colaborativo`) con icono en tile `bg-accent-soft`, hover `hover:border-accent/40 hover:shadow-lg`, copy con acentos.
- [ ] **Step 3:** CTA final: eyebrow `ACCESO`, título `font-display`, botón primario degradado, aurora suave. Quitar el CTA "Acceder al panel" del hero duplicado (el primario del hero ya enlaza a /login).
- [ ] **Step 4:** Copys con acentos ("Gestión de tickets", "diseñadas", "¿Listo para empezar?").
- [ ] **Step 5:** Verificación: responsive 360px/768px/1280px, contraste visual, `prefers-reduced-motion` sin animaciones nuevas dependientes de scroll. `npm run lint` → 0. Commit: `git commit -m "feat: landing reestructurada con hero split y ticket perforado"`.

### Task 20: `LoginPage` — split-screen y sin botón muerto

**Files:**
- Modify: `src/pages/LoginPage.jsx`

**Interfaces:**
- Consumes: `LogoMark`, `buttonPrimaryClass`, degradados Task 10.

- [ ] **Step 1:** Split: panel izquierdo `hidden lg:flex` con aurora azul-violeta, `LogoMark` + wordmark, tagline y 3 bullets ("Colas organizadas", "SLA bajo control", "Historial completo"); panel derecho con el form actual (card sobre `bg`).
- [ ] **Step 2:** Eliminar el botón "Olvidaste tu contrasena?" (muerto: no existe endpoint). Copys con acentos ("Iniciar sesión", "Contraseña", "Correo electrónico", "Recordar sesión").
- [ ] **Step 3:** Botón submit con `buttonPrimaryClass` (degradado, texto oscuro) y spinner actual.
- [ ] **Step 4:** Verificación manual: login OK navega a `/dashboard`; credenciales inválidas muestran el banner. `npm test`/`lint` → verde. Commit: `git commit -m "feat: login split-screen; eliminar boton muerto de contrasena"`.

### Task 21: `NotFoundPage` — Ticket #404

**Files:**
- Modify: `src/pages/NotFoundPage.jsx`

- [ ] **Step 1:** Composición centrada: `TicketMock notFound` (badge "NO ENCONTRADO", `#TKT-404`), h1 `font-display` "Página no encontrada", texto "La página que buscas no existe o fue movida." (con acentos), CTA "Volver al inicio" con `buttonPrimaryClass`.
- [ ] **Step 2:** Verificación: `/ruta-inexistente` renderiza el 404 con layout público. Commit: `git commit -m "feat: 404 on-brand con TicketMock NO ENCONTRADO"`.

## Fase 4 — Bugs restantes

### Task 22: Deep links — `ProtectedRoute` preserva el destino

**Files:**
- Modify: `src/components/ProtectedRoute.jsx:7-9`, `src/pages/LoginPage.jsx:79`

- [ ] **Step 1:** `ProtectedRoute`: `<Navigate to="/login" replace state={{ from: location }} />` (con `useLocation`).
- [ ] **Step 2:** `LoginPage` tras login exitoso: `navigate(location.state?.from?.pathname ?? '/dashboard', { replace: true })`.
- [ ] **Step 3:** Verificación manual: cerrar sesión estando en `/tickets/1`, abrir ese URL → login → aterriza en `/tickets/1`. Commit: `git commit -m "fix: deep links perdidos al redirigir a login"`.

### Task 23: Interceptor 401 robusto

**Files:**
- Modify: `src/api/client.js:27-41`

- [ ] **Step 1:** Guard de redirect único: flag módulo-nivel `let redirecting = false`; si ya está en curso, solo reject. Excluir la petición de login (`error.config?.url` incluye `/login` → no redirect, el error lo maneja el form).
- [ ] **Step 2:** Al expulsar por 401 fuera de `/login`, redirigir a `/login` (hard redirect acepto, ya cubierto por Task 22 para el flujo normal).
- [ ] **Step 3:** `npm test` → verde. Commit: `git commit -m "fix: redirects 401 duplicados y expulsion durante el login"`.

### Task 24: Listas silenciosamente truncadas — `per_page` explícito

**Files:**
- Modify: `src/pages/UsersPage.jsx` (`listUsers({ per_page: 100 })`), `src/pages/CategoriesPage.jsx` (`listCategories({ per_page: 100 })`), `src/pages/NotificationsPage.jsx` (`listNotifications({ per_page: 100 })`), `src/pages/TicketDetailPage.jsx` (`listSupportAgents({ per_page: 100 })`), `src/pages/TicketsPage.jsx` (píldoras de categoría: `listCategories({ per_page: 100 })`)

- [ ] **Step 1:** Añadir el parámetro en las 5 llamadas (la API Laravel pagina a 15 por defecto y hoy recorta sin avisar).
- [ ] **Step 2:** `npm test`/`lint` → verde. Commit: `git commit -m "fix: listas sin paginacion pedian solo 15 resultados por defecto"`.

### Task 25: `createTicket` — adjuntos no bloqueantes

**Files:**
- Modify: `src/api/support.js:17-27`, `src/pages/CreateTicketPage.jsx`

**Interfaces:**
- Produce: `createTicket(payload, attachments)` resuelve SIEMPRE que el ticket se cree; devuelve `{ created, failedAttachments: number }`.

- [ ] **Step 1:** `Promise.all` → `Promise.allSettled` en la subida de adjuntos; contar rechazados y devolverlos sin lanzar.
- [ ] **Step 2:** `CreateTicketPage`: tras crear, navegar al detalle del ticket y `showToast( failedAttachments > 0 ? 'Ticket creado, pero N adjuntos fallaron.' : 'Ticket creado.' , failedAttachments > 0 ? 'notice' : 'success')` — evita tickets duplicados por reintento.
- [ ] **Step 2b:** Quitar el `FieldError` duplicado bajo el campo Descripción (línea ~104): el error de la mutación ya se muestra en el banner global — BUG-34.
- [ ] **Step 3:** `npm test`/`lint` → verde. Commit: `git commit -m "fix: adjuntos fallidos generaban tickets duplicados al reintentar"`.

### Task 26: `CategoriesPage` — refresco con error visible

**Files:**
- Modify: `src/pages/CategoriesPage.jsx:48-79`

- [ ] **Step 1:** Tras cada mutación exitosa, aislar `await loadCategories()` en su propio try/catch → en fallo, `showToast('Categoría guardada, pero no se pudo refrescar la lista.', 'notice')` en vez de tragarlo.
- [ ] **Step 2:** `npm test`/`lint` → verde. Commit: `git commit -m "fix: error de refresco tras mutacion de categorias quedaba silencioso"`.

### Task 27: `withEndpointFallback` — solo para GET/POST

**Files:**
- Modify: `src/api/request.js:20-39`, `src/api/support.js:89-99`

- [ ] **Step 1:** En `support.js`, `updateCategory` y `deleteCategory` pasan a llamar directamente al primer endpoint válido (`apiRoutes.categories[0]`) sin fallback en PATCH/DELETE por id (un 404 legítimo no debe reintentarse contra otra familia de recursos con el mismo id).
- [ ] **Step 2:** `withEndpointFallback` queda para `listCategories`/`createCategory` (GET/POST).
- [ ] **Step 3:** `npx vitest run src/api/__tests__/request.test.js` → verde (ajustar los tests del fallback si prueban PATCH). Commit: `git commit -m "fix: fallback de endpoints reintenta PATCH/DELETE contra recursos equivocados"`.

### Task 28: `PaginationBar` — clamp y aria

**Files:**
- Modify: `src/components/PaginationBar.jsx`
- Test: `src/components/__tests__/PaginationBar.test.jsx` (existe)

- [ ] **Step 1:** `const current = Math.min(page, totalPages)` para el cálculo de páginas visibles; `aria-current="page"` en el activo; `aria-label="Página anterior"` / `"Página siguiente"` en los botones de flecha.
- [ ] **Step 2:** Test: con `page=10, totalPages=3` renderiza páginas y sin crash. Run → ajustar → verde. Commit: `git commit -m "fix: paginacion sin botones al reducirse el total + aria"`.

### Task 29: `UsersPage` — lote de correcciones

**Files:**
- Modify: `src/pages/UsersPage.jsx:104-107,140-147,208,260-272,275,499`

- [ ] **Step 1:** Tabla: `formatDate(item.created_at)`; badge de rol con `getRoleLabel(item.role ?? 'user')`; `Fila {entry.row ?? '?'}`.
- [ ] **Step 2:** Descarga de plantilla: `URL.revokeObjectURL` dentro de `setTimeout(..., 0)`.
- [ ] **Step 3:** Al elegir archivo, limpiar el error previo del input.
- [ ] **Step 4:** `minLength={6}` en el campo `password` de crear usuario (igual que en importación).
- [ ] **Step 5:** Guard de autodemoción: si el admin cambia SU PROPIO rol, `showToast('No puedes cambiar tu propio rol.', 'error')` y no enviar; cambios de rol de otros piden confirmación con `ConfirmModal`.
- [ ] **Step 6:** `npm test`/`lint` → verde. Commit: `git commit -m "fix: UsersPage — fecha cruda, rol sin etiqueta, autodemocion y descargas"`.

### Task 30: `DashboardLayout` — quitar búsqueda decorativa + acentos

**Files:**
- Modify: `src/layouts/DashboardLayout.jsx:179-186`

- [ ] **Step 1:** Eliminar el input de búsqueda del header (no está conectado a nada; engaña al usuario). Mantener notificaciones y avatar.
- [ ] **Step 2:** Copys del layout con acentos ("Categorías", "Cerrar sesión", "Expandir/Colapsar barra lateral").
- [ ] **Step 3:** `npm test`/`lint` → verde. Commit: `git commit -m "fix: quitar busqueda decorativa del header y acentos del layout"`.

### Task 31: Eliminar código muerto `useKeyboardShortcuts`

**Files:**
- Delete: `src/hooks/useKeyboardShortcuts.js` (sin referencias en todo `src/` — verificado con grep)

- [ ] **Step 1:** Confirmar con el usuario antes de borrar (higiene de código muerto). Sin uso actual; si se adopta en el futuro, reimplementar con guards de `metaKey`/`repeat`.
- [ ] **Step 2:** `git rm src/hooks/useKeyboardShortcuts.js`. Commit: `git commit -m "refactor: eliminar hook useKeyboardShortcuts muerto (sin referencias)"`.

### Task 32: `vercel.json` — excluir `/api` del rewrite catch-all

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1:** Añadir ANTES del catch-all un rewrite `"source": "/api/(.*)", "destination": "/api/$1"` con `statusCode: 404` explícito (o excluir con `"source": "/((?!api/).*)"` en el catch-all) — evita servir `index.html` con 200 a llamadas API same-origin.
- [ ] **Step 2:** Commit: `git commit -m "fix: rewrite catch-all de Vercel capturaba /api y servia HTML con 200"`.

### Task 33: README + ortografía global restante

**Files:**
- Modify: `README.md`, `src/lib/ticket.js`, `src/pages/DashboardPage.jsx`, `src/pages/TicketsPage.jsx`, `src/pages/TicketDetailPage.jsx`, `src/pages/CreateTicketPage.jsx`, `src/pages/CategoriesPage.jsx`, `src/pages/NotificationsPage.jsx`, `src/pages/ProfilePage.jsx`

- [ ] **Step 1:** README: eliminar toda mención de modo claro/toggle/`localStorage` de tema (sección "Experiencia de Usuario" y "Dark Mode" en logros técnicos); documentar dark-only con la nueva identidad; actualizar sección de estructura (`SupportUi` con LogoMark/TicketMock).
- [ ] **Step 2:** Ortografía con acentos en TODOS los textos visibles: "Últimos tickets", "Categoría/Categorías", "Descripción", "Asignación", "Notificación/leídas", "Contraseña", "Página", y en `lib/ticket.js` ("Sin título", "Sin categoría", etiquetas de rol). Lista exacta de líneas en Anexo A (BUG-28).
- [ ] **Step 3:** `npm test` → verde (ajustar `constants.test.js`/`ticket.test.js` si asertan strings sin acentos). Commit: `git commit -m "fix: ortografia con acentos en toda la UI y README actualizado a dark-only"`.

## Fase 5 — Verificación final

### Task 34: Verificación integral

- [ ] **Step 1:** `npm run lint` → 0 errores. `npm test` → todos en verde. `npm run build` → exitoso. `npm run preview` → smoke manual.
- [ ] **Step 2:** Revisión visual en 360px/768px/1280px de: Landing, Login, 404, Dashboard, Tickets, TicketDetail, Categories, Users, Notifications, Profile. Confirmar: fondo `#08080c` en todas, sin restos de modo claro, degradados solo en CTA/logo/auroras/hairlines, foco visible al tabular.
- [ ] **Step 3:** Pasada de contraste: texto normal ≥ 4.5:1; botón degradado con texto oscuro legible en ambos extremos.
- [ ] **Step 4:** Revisión de código de la rama completa con `code-review-and-quality` antes de merge/deploy.

## Anexo A — Reporte de bugs (verificados)

Severidades: **Critical** (rompe función principal), **High** (pérdida de datos o función clave degradada), **Medium** (robustez/a11y/seguridad), **Low** (calidad percibida). Todos fueron verificados contra el código del working tree; líneas aproximadas.

### Critical

| ID | Bug | Dónde | Fix |
|----|-----|-------|-----|
| BUG-01 | **Paginación rota**: `request.get` desenvuelve `response.data.data` y `paginationFromPayload` vuelve a desenvolver → `meta` siempre `null`, "0 resultados" con filas visibles y `PaginationBar` nunca aparece (listado clavado en página 1) con el sobre estándar Laravel | `src/api/request.js:4-6`, `src/lib/normalizers.js:30-34`, `src/pages/TicketsPage.jsx:43-50` | Task 4 |
| BUG-02 | **`lucide-react` extraneous**: importado en `SupportUi.jsx` pero ausente de `package.json` → un `npm install` limpio rompe build y dev | `package.json`, `src/components/SupportUi.jsx:1-33` | Task 1 |

### High

| ID | Bug | Dónde | Fix |
|----|-----|-------|-----|
| BUG-03 | Sin `VITE_API_URL`, `api` es `null` → `TypeError: Cannot read properties of null` en cada llamada; crash críptico total | `src/api/client.js:3-14` | Task 3 |
| BUG-04 | **Selects de estado/agente nunca inicializados**: `initialStatus`/`initialAgentId` se calculan pero no se consumen; el select de estado nace vacío, y "Guardar asignación" sin tocar envía `null` y **desasigna al agente real** | `src/pages/TicketDetailPage.jsx:45-46,64-65` | Task 6 |
| BUG-05 | Dashboard: `Promise.allSettled` nunca rechaza → el banner `{error}` es inalcanzable; fallos muestran ceros en silencio. Además `total_tickets` cae a `recentTickets.length` (máx. 5) — cifra inventada | `src/pages/DashboardPage.jsx:48-65,104-115` | Task 7 |
| BUG-06 | Cambio de contraseña llamado fuera de `execute`: si falla, el catch lo traga → el usuario cree que cambió su contraseña. Sin validación de confirmación; perfil desincronizado | `src/pages/ProfilePage.jsx:51-69` | Task 8 |
| BUG-07 | `useAsync`: al cambiar deps no activa `loading` (lista obsoleta sin skeleton) y `error` nunca se limpia (banner eterno tras un fallo puntual) | `src/hooks/useAsync.js:14-36` — afecta 6+ páginas | Task 5 |
| BUG-08 | `updateUser(undefined)` guarda la cadena `"undefined"` en localStorage → `JSON.parse` revienta al arrancar y la sesión visual se pierde | `src/context/AuthContext.jsx:49-54` | Task 9 |
| BUG-09 | Si la API no devuelve `user`, se fabrica `{role: 'user'}` → un admin sin objeto user ve UI de usuario normal (permisos decididos con datos falsos) | `src/context/AuthContext.jsx:16-26` | Task 9 |
| BUG-10 | Lint roto (2 imports muertos + `setState` síncrono en efecto con riesgo de renders en cascada) | `PublicLayout.jsx:3`, `ToastContext.jsx:3`, `DashboardLayout.jsx:52-54` | Task 2 |

### Medium

| ID | Bug | Dónde | Fix |
|----|-----|-------|-----|
| BUG-11 | Interceptor 401: redirect duro sin guardar el destino, sin guard contra 401s concurrentes y estado inconsistente si ocurre en `/login` | `src/api/client.js:27-41` | Task 22/23 |
| BUG-12 | Token bearer de larga vida en `localStorage` (robo por XSS) y `isAuthenticated: Boolean(token)` sin validar expiración — mitigación real requiere cookie httpOnly (backend) | `src/api/client.js:18`, `src/context/AuthContext.jsx:91` | Anexo B |
| BUG-13 | `Promise.all` todo-o-nada en detalle: si fallan comentarios O adjuntos, el ticket completo es inaccesible con solo un error | `src/pages/TicketDetailPage.jsx:53-57` | Task 6 |
| BUG-14 | Listas sin `per_page` ni UI de paginación: si la API pagina por defecto (Laravel: 15), usuarios/categorías/notificaciones/agentes se **truncan en silencio** | `UsersPage`, `CategoriesPage`, `NotificationsPage`, `TicketDetailPage`, `TicketsPage` (píldoras) | Task 24 |
| BUG-15 | Tras mutar categoría, el refresco va dentro del mismo `try`: si falla, el catch lo traga — toast de éxito con lista desactualizada | `src/pages/CategoriesPage.jsx:48-79` | Task 26 |
| BUG-16 | `createTicket` sube adjuntos con `Promise.all`: un adjunto fallido reporta "error de creación" cuando el ticket YA existe → el reintento **duplica el ticket** | `src/api/support.js:17-27`, `CreateTicketPage.jsx` | Task 25 |
| BUG-17 | Timeout global 10s aborta subidas de adjuntos e importación de CSV en conexiones lentas | `src/api/client.js:8` | Task 3 |
| BUG-18 | `withEndpointFallback` en PATCH/DELETE por id: un 404 legítimo se reintenta contra otra familia de recursos (puede tocar el recurso equivocado con el mismo id) | `src/api/request.js:20-39`, `support.js:89-99` | Task 27 |
| BUG-19 | `TopProgressBar`: `setTimeout` anidados sin cleanup → en navegaciones rápidas apagan la barra durante una carga nueva; timers viven tras unmount | `src/components/TopProgressBar.jsx:22-29` | Task 15 |
| BUG-20 | `ConfirmModal`: sin focus trap, foco inicial en la acción destructiva (Enter accidental borra), sin restaurar foco, sin `aria-modal` | `src/components/ConfirmModal.jsx` | Task 16 |
| BUG-21 | `ToastContext`: timers sin limpiar (setState post-unmount; cerrar manual deja el timer vivo) y botón de cierre sin `aria-label` | `src/context/ToastContext.jsx:26-28,49-57` | Task 14 |
| BUG-22 | `PaginationBar`: con `page > totalPages` no renderiza números ni clampa; página activa sin `aria-current`; flechas sin `aria-label` | `src/components/PaginationBar.jsx:26-73` | Task 28 |
| BUG-23 | `ProtectedRoute` no preserva la URL destino → deep links (`/tickets/42` sin sesión) mueren en `/dashboard` | `src/components/ProtectedRoute.jsx:7-9` | Task 22 |
| BUG-24 | `vercel.json` rewrite catch-all `/(.*)` también captura `/api/*` → HTML servido con status 200 a llamadas API same-origin | `vercel.json:2-7` | Task 32 |
| BUG-25 | Cambio de rol dispara al instante sin confirmación; un admin puede **autodemoverse** y la UI de admin queda en pantalla mientras la API da 403 | `src/pages/UsersPage.jsx:214-224` | Task 29 |
| BUG-26 | Botón "Olvidaste tu contraseña?" sin handler y sin endpoint en el backend (link muerto) | `src/pages/LoginPage.jsx:170-175` | Task 20 |
| BUG-27 | **Residuos del modo claro**: la versión desplegada (HEAD) aún tiene el toggle (localStorage `theme` + "Modo claro/oscuro"); el working tree lo quitó pero sobreviven `:root` claro, `:root.dark`, `@custom-variant dark`, `class="dark"` en `index.html`, iconos `sun/moon` en `iconMap` y README que promete toggle | `index.html:2`, `index.css:3,22-33`, `SupportUi.jsx:29-30,63-64`, `README.md` | Tasks 10-12, 33 |

### Low

| ID | Bug | Dónde | Fix |
|----|-----|-------|-----|
| BUG-28 | Ortografía sin acentos en TODA la UI ("Gestion", "Categoria", "Contrasena", "sesion", "disenadas", "Pagina"…) — resta profesionalismo | `lib/ticket.js:43,51`; Dashboard:144; Tickets:97,183; Detail:104,184,201-203,314,349,366; Create:93,110,119; Categories:54,85,105,215,234,250,259; Users:72,105,122,167,340,417,423; Profile:44,135,149,163; Notifications:38,73,104,124; NotFound:14,16 | Task 33 + Fase 3 |
| BUG-29 | UsersPage: fecha ISO cruda en tabla (275), rol crudo en badge (208), "Fila undefined" en importación (499), `revokeObjectURL` prematuro (140-147), error de archivo no limpiado (104-107), `minLength` inconsistente entre crear e importar | `src/pages/UsersPage.jsx` | Task 29 |
| BUG-30 | Adjuntos sin URL renderizan `href="#"` con `target="_blank"` → abre la propia app en pestaña nueva | `src/pages/TicketDetailPage.jsx:412-418` | Task 6 |
| BUG-31 | Input de búsqueda del header puramente decorativo (sin handler) — parece funcional y no hace nada | `src/layouts/DashboardLayout.jsx:179-186` | Task 30 |
| BUG-32 | Footer con enlaces muertos ("Documentación", "Estado del sistema" como `<span>`) | `src/components/PublicLayout.jsx:81-91` | Task 17 |
| BUG-33 | `useKeyboardShortcuts.js` sin ninguna referencia (código muerto; de adoptarse: faltan guards de `metaKey`/`repeat`) | `src/hooks/useKeyboardShortcuts.js` | Task 31 |
| BUG-34 | Error de creación renderizado dos veces (banner global + `FieldError` bajo "Descripción" sugiriendo que es error del campo) | `src/pages/CreateTicketPage.jsx:67-71,104` | Task 25 |
| BUG-35 | Warning de `act(...)` en la suite de ToastContext (setup ruidoso) | `src/context/__tests__/ToastContext.test.jsx` | Task 14 |
| BUG-36 | `index.html` sin `theme-color` y con `class="dark"` hardcodeada | `index.html:2` | Task 11 |

## Anexo B — Fuera de alcance (requiere backend o decisión de producto)

1. **Token en cookie httpOnly** (BUG-12): la mitigación real del robo por XSS es mover la sesión a cookies `httpOnly`+`SameSite` gestionadas por Laravel, o tokens de vida corta + refresh. Cambio de contrato backend.
2. **Flujo "olvidé mi contraseña"**: requiere endpoint de reset en el backend (`apiRoutes.js` no tiene ninguno). Al eliminar el botón muerto queda pendiente como feature futura.
3. **Paginación UI completa** en Users/Categorías/Notificaciones (Task 24 la hace funcional con `per_page` alto; la UI con `PaginationBar` sería una iteración posterior si los volúmenes lo piden).
4. **`isAuthenticated` decodificando `exp` del JWT**: sin biblioteca de parsing, no es fiable; se recomienda validar server-side en cada request (ya ocurre — el 401 expulsa).

## Verificación del plan (self-review)

- Cobertura: los 36 bugs del Anexo A apuntan a una task; los requisitos del brief (dark-only, paleta, reestructuración pública) tienen tasks dedicadas (10-21). ✓
- Cada task produce un commit verificable; TDD en fixes de lógica (4, 5, 9, 16, 18, 28) y verificación manual en visuales. ✓
- Dependencias de interfaces: Tasks 10-12 producen tokens/utilidades/botones/LogoMark que consumen 17-21; Task 4 produce `getEnvelope` que consume `listTickets`. ✓
