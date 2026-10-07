import { Link } from 'react-router'
import PublicLayout from '../components/PublicLayout'
import { Icon } from '../components/SupportUi'

export default function NotFoundPage() {
  return (
    <PublicLayout>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
        <div className="grid h-32 w-32 place-items-center rounded-full bg-surface">
          <Icon className="h-16 w-16 text-muted" name="shield" />
        </div>

        <h1 className="mt-6 text-6xl font-bold tracking-tight text-text">404</h1>
        <p className="mt-4 text-xl font-semibold text-text">Pagina no encontrada</p>
        <p className="mt-2 max-w-md text-sm text-muted">
          La pagina que buscas no existe o fue movida.
        </p>
        <Link
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90 active:scale-[0.98]"
          to="/"
        >
          <Icon name="home" className="h-4 w-4" />
          Volver al inicio
        </Link>
      </div>
    </PublicLayout>
  )
}