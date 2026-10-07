import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { buttonPrimaryClass, LogoMark } from './SupportUi'

export default function PublicLayout({ children }) {
  const [scrollRatio, setScrollRatio] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setScrollRatio(Math.min(window.scrollY / 150, 1))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const bgColor = `rgba(8, 8, 12, ${0.85 * scrollRatio})`

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
          <Link aria-label="Support Tickets — inicio" className="flex items-center" to="/">
            <LogoMark size={36} withWordmark />
          </Link>

          <Link className={buttonPrimaryClass} to="/login">
            Acceder al panel
          </Link>
        </div>
      </nav>

      <main className="pt-14">{children}</main>

      <footer className="border-t border-border bg-bg">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          <LogoMark size={28} withWordmark />

          <nav aria-label="Pie de página" className="flex items-center gap-6 text-sm text-muted">
            <Link className="transition hover:text-text" to="/">
              Inicio
            </Link>
            <Link className="transition hover:text-text" to="/login">
              Acceder
            </Link>
          </nav>

          <p className="text-xs text-muted">
            &copy; 2026 Support Tickets. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
