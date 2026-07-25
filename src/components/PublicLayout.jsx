import { useEffect, useState } from 'react'
import { Link } from 'react-router'

export default function PublicLayout({ children }) {
  const [scrolled, setScrolled] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[var(--color-app)]">
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all ${
          scrolled
            ? 'bg-white/80 shadow-sm backdrop-blur-lg dark:bg-zinc-900/80'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" to="/">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400 text-sm font-bold text-emerald-950 shadow-lg shadow-emerald-400/20">
              ST
            </div>
            <span className="font-bold text-zinc-950 dark:text-white">Support Tickets</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              className="rounded-lg border border-zinc-300 p-2 text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
              onClick={() => setDark((d) => !d)}
              title={dark ? 'Modo claro' : 'Modo oscuro'}
              type="button"
            >
              {dark ? (
                <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            <Link
              className="rounded-lg border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
              to="/login"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-16">{children}</main>

      <footer className="border-t border-zinc-200 bg-[var(--color-app)] dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400 text-sm font-bold text-emerald-950">
                  ST
                </div>
                <span className="font-bold text-zinc-950 dark:text-white">Support Tickets</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                Plataforma de gestión de tickets para clientes, agentes y administradores.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">Navegación</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link className="text-sm text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100" to="/">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link className="text-sm text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100" to="/login">
                    Acceder
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">Recursos</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <span className="text-sm text-zinc-400 dark:text-zinc-500">Documentación</span>
                </li>
                <li>
                  <span className="text-sm text-zinc-400 dark:text-zinc-500">Estado del sistema</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <p className="text-xs text-zinc-400 dark:text-zinc-500">&copy; 2026 Support Tickets. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
