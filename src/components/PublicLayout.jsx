import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Icon } from './SupportUi'

export default function PublicLayout({ children }) {
  const [scrollRatio, setScrollRatio] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setScrollRatio(Math.min(window.scrollY / 150, 1))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const bgColor = `rgba(10, 10, 11, ${0.85 * scrollRatio})`

  return (
    <div className="min-h-screen bg-bg">
      <nav
        className="fixed inset-x-0 top-0 z-50 border-b transition-colors"
        style={{
          backgroundColor: bgColor,
          backdropFilter: scrollRatio > 0 ? `blur(12px)` : 'none',
          WebkitBackdropFilter: scrollRatio > 0 ? `blur(12px)` : 'none',
          borderColor: scrollRatio > 0 ? 'var(--color-border)' : 'transparent',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" to="/">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-sm font-bold text-white shadow-lg shadow-accent/20">
              ST
            </div>
            <span className="hidden font-semibold text-text sm:inline">Support Tickets</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              className="rounded-lg border border-accent/40 px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent-soft"
              to="/login"
            >
              Acceder al panel
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-14">{children}</main>

      <footer className="border-t border-border bg-bg">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-sm font-bold text-white">
                  ST
                </div>
                <span className="font-semibold text-text">Support Tickets</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">
                Plataforma de gestion de tickets para clientes, agentes y administradores.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-text">Navegacion</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link className="text-sm text-muted transition hover:text-text" to="/">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link className="text-sm text-muted transition hover:text-text" to="/login">
                    Acceder
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-text">Recursos</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <span className="text-sm text-muted">Documentacion</span>
                </li>
                <li>
                  <span className="text-sm text-muted">Estado del sistema</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center border-t border-border pt-8">
            <p className="text-xs text-muted">&copy; 2026 Support Tickets. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}