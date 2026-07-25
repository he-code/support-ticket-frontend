import { Link } from 'react-router'
import PublicLayout from '../components/PublicLayout'

export default function NotFoundPage() {
  return (
    <PublicLayout>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
        <svg aria-hidden="true" className="h-32 w-32 text-emerald-200 dark:text-emerald-800" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" strokeWidth="1.2" />
          <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="none" />
        </svg>

        <h1 className="mt-6 text-6xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
          404
        </h1>
        <p className="mt-4 text-xl font-semibold text-zinc-700 dark:text-zinc-300">
          Página no encontrada
        </p>
        <p className="mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
          La página que buscas no existe o fue movida.
        </p>
        <Link
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
          to="/"
        >
          <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <path d="M9 22V12h6v10" />
          </svg>
          Volver al inicio
        </Link>
      </div>
    </PublicLayout>
  )
}
