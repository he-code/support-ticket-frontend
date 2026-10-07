import { Link } from 'react-router'
import PublicLayout from '../components/PublicLayout'
import TicketMock from '../components/TicketMock'
import { buttonPrimaryClass, Icon } from '../components/SupportUi'

export default function NotFoundPage() {
  return (
    <PublicLayout>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-full max-w-xs">
          <TicketMock notFound />
        </div>

        <h1 className="mt-8 font-display text-5xl font-bold tracking-tight text-text">
          404
        </h1>
        <p className="mt-3 text-xl font-semibold text-text">Página no encontrada</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          La página que buscas no existe o fue movida. Si crees que es un error,
          abre un ticket con el equipo de soporte.
        </p>
        <Link
          className={`${buttonPrimaryClass} mt-8 px-5 py-2.5`}
          to="/"
        >
          <Icon name="home" className="h-4 w-4" />
          Volver al inicio
        </Link>
      </div>
    </PublicLayout>
  )
}
