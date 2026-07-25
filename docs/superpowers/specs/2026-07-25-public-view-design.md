# Public View Design

## Objective

Improve the public-facing views of the Support Tickets system: a landing page, a refined login page, and a 404 error page — all sharing consistent branding and a polished user experience.

## Routes

| Path      | Page              | Auth Required | Notes                               |
|-----------|-------------------|---------------|-------------------------------------|
| `/`       | `LandingPage`     | No            | New — replaces the `/dashboard` redirect |
| `/login`  | `LoginPage`       | No            | Existing — improved UX              |
| `*`       | `NotFoundPage`    | No            | New — replaces `/dashboard` redirect |

All authenticated routes (`/dashboard`, `/tickets`, etc.) remain unchanged behind `ProtectedRoute`.

## Landing Page

A single-scroll marketing page with five sections.

### Navbar
- Fixed, transparent with backdrop blur on scroll
- Logo `ST` + "Support Tickets" brand
- "Iniciar sesión" button (outlined, navigates to `/login`)
- Dark mode persists based on user preference

### Hero
- Full-viewport, centered content
- Gradient background (dark green to emerald tones) with subtle decorative pattern
- Headline: "Soporte ordenado para clientes, agentes y administradores."
- Subheadline describing the platform value
- CTA button "Acceder al panel →" linking to `/login`
- Fade-in entrance animation (CSS keyframes)

### Features
- 3-column grid on desktop, stacked on mobile
- Cards with icon + title + description:
  - **Gestión de Tickets** — Seguimiento, estados, prioridades y comentarios en un solo lugar
  - **SLA y Prioridades** — Define tiempos de respuesta por nivel de urgencia
  - **Equipo Colaborativo** — Agentes, asignaciones y notificaciones en tiempo real
- Subtle hover lift effect

### Stats
- 4 stat indicators in a row:
  - `10K+` Tickets gestionados
  - `99%` SLA cumplido
  - `50+` Agentes activos
  - `4.9★` Satisfacción
- Large numbers, small labels

### CTA Final
- Centered section: "¿Listo para empezar?"
- Primary CTA button "Acceder al panel →"

### Footer
- 3-column layout: brand + description, navegación (links to login), recursos
- Dark mode toggle
- Copyright line

## Login Page Improvements

- **Password visibility toggle** — eye icon button inside the password field
- **"Recordar sesión" checkbox** — persists email in localStorage
- **Field-level validation** — show per-field errors instead of a single generic error
- **Transition on mount** — form fades in, error messages slide down
- Keep existing split layout (brand panel left, form right on desktop; full-screen on mobile)
- Keep existing dark mode toggle

## 404 Page

- Centered layout with a simple SVG illustration
- "Página no encontrada" heading
- "La página que buscas no existe o fue movida." description
- "Volver al inicio" button linking to `/`
- Same palette and dark mode support

## Shared Components

### `PublicLayout`
- Wraps public pages with Navbar (top) and Footer (bottom)
- Adds top padding to account for fixed navbar

### `Navbar`
- Transparent by default, `bg-white/80 backdrop-blur` on scroll (via Intersection Observer or scroll listener)
- Logo + brand on left, "Iniciar sesión" button on right

### `Footer`
- Static links, copyright, dark mode toggle

## Styling

- Same Tailwind CSS v4 setup (no new dependencies)
- Same color palette (emerald/lime tones, zinc grays)
- CSS custom properties for theme
- Dark mode via `.dark` class (existing system)
- Animations: CSS `@keyframes` only (fade-in, slide-up, hover transitions)

## Design Decisions

- **No JavaScript animation libraries** — Tailwind + CSS keyframes keep the bundle small and avoid dependencies
- **No new backend routes** — all pages are static frontend
- **Reuse existing branding** — ST logo, emerald palette, Inter font
- **YAGNI** — forgot/reset password pages are deferred until backend supports them

## Implementation Plan

### Files to create
- `src/components/PublicLayout.jsx` — shared Navbar + Footer wrapper
- `src/pages/LandingPage.jsx` — Hero + Features + Stats + CTA
- `src/pages/NotFoundPage.jsx` — 404 page

### Files to modify
- `src/pages/LoginPage.jsx` — password toggle, remember me, field validation, transitions
- `src/main.jsx` — add LandingPage at `/`, NotFoundPage at `*`

### Order
1. PublicLayout (creates dependency for LandingPage)
2. LandingPage
3. LoginPage improvements
4. NotFoundPage
5. Routing update in main.jsx

## Future Considerations

- Animated stat counters (Intersection Observer + `requestAnimationFrame`)
- Micro-interactions with GSAP if more complex animations are needed later
