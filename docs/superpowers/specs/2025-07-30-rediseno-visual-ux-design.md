# Rediseño Visual y UX — Support Ticket Frontend

**Fecha:** 2026-07-30
**Estado:** Aprobado para implementación

---

## 1. Objetivo

Transformar la interfaz del panel de soporte técnico en una experiencia visual moderna, premium y cohesiva — manteniendo la arquitectura actual y sin refactorizar la estructura de archivos.

---

## 2. Stack y dependencias

| Recurso | Actual | Nuevo |
|---------|--------|-------|
| Iconos | SVG inline | `lucide-react` |
| CSS | Tailwind 4 | Tailwind 4 (sin cambios) |
| Animaciones | Ninguna | Transiciones CSS + Tailwind |
| Tipografía | System-ui | `Inter` (body/headings) + `JetBrains Mono` (códigos) |

---

## 3. Sistema de Tokens

### Paleta (dark mode first — modo claro se deriva automáticamente)

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-bg` | `#0a0a0b` | Fondo principal (pantalla) |
| `--color-surface` | `#18181b` | Cards, sidebar, paneles |
| `--color-surface-hover` | `#27272a` | Hover de elementos |
| `--color-border` | `#27272a` | Bordes y separadores |
| `--color-muted` | `#a1a1aa` | Texto secundario |
| `--color-text` | `#fafafa` | Texto primario |
| `--color-accent` | `#3b82f6` | Acento principal (blue-500) |
| `--color-accent-soft` | `#3b82f615` | Glow/glass sutil del acento |
| `--color-success` | `#10b981` | Verde esmeralda |
| `--color-warning` | `#f59e0b` | Ámbar |
| `--color-danger` | `#ef4444` | Rojo |
| `--color-info` | `#06b6d4` | Cian informativo |

### Tipografía

| Rol | Fuente | Peso | Tamaños |
|-----|--------|------|---------|
| Display / Headings | `Inter` | 600-700 | text-xl (1.25rem) → text-3xl (1.875rem) |
| Body | `Inter` | 400 | text-sm (0.875rem) → text-base (1rem) |
| Códigos / IDs | `JetBrains Mono` | 400-500 | text-xs → text-sm |

### Bordes y radios

| Elemento | Border-radius |
|----------|---------------|
| Cards / Paneles | `rounded-xl` (12px) |
| Botones | `rounded-lg` (8px) |
| Badges | `rounded-full` |
| Inputs | `rounded-lg` (8px) |
| Sidebar | `rounded-r-2xl` (16px solo derecha) |

---

## 4. Layout

### Sidebar (Desktop ≥1024px)

```
┌──────────────┬──────────────────────────────────────┐
│  ST v1.0     │  (Header minimal)                    │
│  ─────────── │  search...          🔔 🌙 👤         │
│  ◆ Dashboard │  ─────────────────────────────────   │
│  ◎ Tickets   │                                      │
│  ＋ New      │       < Outlet />                     │
│  ◇ Categories│                                      │
│  👥 Users    │                                      │
│  🔔 Notifs   │                                      │
│  👤 Profile  │                                      │
│              │                                      │
│  ─────────── │                                      │
│  👤 J. Doe   │                                      │
│  ⏻ Logout   │                                      │
└──────────────┴──────────────────────────────────────┘
```

- Ancho: 256px (expandido), 64px (colapsado, solo iconos + tooltips)
- Colapsable vía botón hamburguesa o atajo `Ctrl+B`
- Item activo: barrita de 3px azul a la izquierda + bg más claro
- Responsive mobile: bottom navigation bar con 4 iconos principales

### Header

- Altura: 56px (14)
- Sin fondo propio — hereda `--color-bg`
- Borde inferior sutil `border-b border-border`
- Elementos alineados a la derecha: búsqueda, notificaciones, dark mode, avatar

---

## 5. Componentes de UI (refinados)

### Botones
- Primario: `bg-accent text-white hover:bg-accent/90` + transición
- Secundario: `bg-surface border border-border hover:bg-surface-hover`
- Ghost: `hover:bg-surface-hover text-muted`
- Danger: `bg-danger text-white`
- Estados: loading con spinner, disabled con opacidad

### Inputs
- Fondo: `bg-surface` con `border border-border`
- Focus: `ring-2 ring-accent/30 border-accent`
- Placeholder: `text-muted/50`
- Icono izquierdo opcional

### Badges
- Fondo con opacidad 10-15% del color de tono
- Texto del color de tono
- `rounded-full px-2.5 py-0.5 text-xs font-medium`

### Cards
- `bg-surface border border-border rounded-xl p-6`
- Hover: `hover:border-accent/30 hover:shadow-md`
- Transición: `transition-all duration-200`

### Modals
- Overlay: `bg-black/60 backdrop-blur-sm`
- Content: `bg-surface border border-border rounded-2xl p-6`
- Animación: `animate-in fade-in zoom-in-95 duration-200`

### Skeleton Loading
- `bg-surface-hover` con shimmer animation
- Gradiente animado: `bg-gradient-to-r from-surface-hover via-surface to-surface-hover`

### Toasts
- Posición: top-right
- Slide-in desde right
- Colores: success (emerald), error (red), notice (blue)
- Auto-dismiss 4s

---

## 6. Micro-interacciones

| Elemento | Interacción |
|----------|-------------|
| Sidebar items | Hover: bg-surface-hover + translate-x-0.5 |
| Cards | Hover: translate-y-[-2px] + shadow-md |
| Botones | Active: scale-95 |
| Notificaciones | Badge pulso suave |
| Loading | Shimmer animation en skeletons |
| Toasts | Slide-in from right, fade-out |
| Página | Fade-in sutil al montar |

---

## 7. Páginas (cambios visuales específicos)

### Landing Page
- Hero con gradiente oscuro + glow azul sutil en el centro
- Logo "ST" grande + tagline + CTA "Acceder al panel"
- 3 features cards con iconos lucide en un grid 3-col
- Footer simple con copyright

### Login
- Card centrada (max-w-md) sobre fondo bg
- Inputs con iconos (Mail, Lock), password toggle con Eye
- Botón "Iniciar sesión" full-width con loading spinner
- Link "¿Olvidaste tu contraseña?" (placeholder, sin funcionalidad)

### Dashboard
- 4 stat cards con icono + label + valor + variación
- Tabla de tickets recientes con header sticky
- Botones "Ver todos" y "Nuevo ticket"

### Tickets List
- Filtros tipo pills (chips) en vez de selects
- Vista: tabla (desktop), cards (mobile)
- Paginación con números
- Badges de estado y prioridad

### Ticket Detail
- 2 columnas: contenido (70%) + sidebar (30%)
- Comentarios con avatares de iniciales + timestamps
- Formulario de comentario al final del thread
- Sidebar: estado (select), agente asignado (select), metadatos

### Create Ticket
- Formulario centrado (max-w-2xl)
- Campos con labels flotantes o estándar
- Drag & drop para adjuntos (opcional)

### Categories, Users, Notifications, Profile
- Misma línea visual: cards con bg-surface, badges, inputs refinados
- Tablas responsivas con header sticky
- Empty states con icono + mensaje + acción

---

## 8. Responsive

| Breakpoint | Comportamiento |
|------------|----------------|
| < 768px | Sidebar → bottom nav (4 iconos). Tablas → cards. |
| 768-1024px | Sidebar colapsado por defecto. Layout 1 columna. |
| ≥ 1024px | Sidebar expandido. Layout 2 columnas donde aplique. |

---

## 9. Modo oscuro / claro

- Predeterminado: oscuro (`class="dark"` en `<html>`)
- Toggle guarda preferencia en localStorage
- Modo claro: invierte bg/surface manteniendo acento azul
- `prefers-reduced-motion`: desactiva transiciones

---

## 10. Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `index.html` | Agregar <link> de Google Fonts (Inter, JetBrains Mono). Actualizar title |
| `src/index.css` | Nuevos tokens CSS, animaciones, shimmer, clases utilitarias |
| `src/components/SupportUi.jsx` | Reemplazar SVG inline por lucide-react. Nuevos estilos |
| `src/components/PublicLayout.jsx` | Nuevo navbar con estilos refinados |
| `src/layouts/DashboardLayout.jsx` | Sidebar colapsable, header minimalista, bottom nav mobile |
| `src/pages/*.jsx` | Aplicar nuevos estilos y componentes a todas las páginas |
| `src/context/ToastContext.jsx` | Toasts con nueva posición y animación |
| `src/components/TopProgressBar.jsx` | Color acento, animación más suave |

---

## 11. No incluido (fuera de alcance)

- Refactor de arquitectura o estructura de carpetas
- Migración de frameworks (React → Next, etc.)
- Nuevas funcionalidades de negocio
- Tests nuevos (los existentes deben seguir pasando)
- Subida de archivos `docs/superpowers/` al remoto