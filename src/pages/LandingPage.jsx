import { Link } from 'react-router'
import PublicLayout from '../components/PublicLayout'

const features = [
  {
    title: 'Gestión de Tickets',
    desc: 'Seguimiento, estados, prioridades y comentarios en un solo lugar.',
    paths: ['M5 4h14v16H5V4z', 'M8 8h8', 'M8 12h8', 'M8 16h5'],
  },
  {
    title: 'SLA y Prioridades',
    desc: 'Define tiempos de respuesta por nivel de urgencia y mantén el control.',
    paths: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  },
  {
    title: 'Equipo Colaborativo',
    desc: 'Agentes, asignaciones y notificaciones en tiempo real.',
    paths: ['M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2', 'M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  },
]

const stats = [
  { value: '10K+', label: 'Tickets gestionados' },
  { value: '99%', label: 'SLA cumplido' },
  { value: '50+', label: 'Agentes activos' },
  { value: '4.9★', label: 'Satisfacción' },
]

function FeaturePaths({ paths }) {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      {paths.map((d) => <path d={d} key={d} />)}
    </svg>
  )
}

export default function LandingPage() {
  return (
    <PublicLayout>
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-950 via-[var(--color-sidebar)] to-emerald-900 px-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(52,211,153,0.08)_0%,_transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-lime-200/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-lime-200">
            Plataforma de gestión
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Soporte ordenado para clientes, agentes y administradores.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-emerald-50/70">
            Tickets, comentarios, adjuntos, estados, asignaciones y usuarios en una sola consola operativa.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-6 py-3 text-sm font-bold text-emerald-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300"
              to="/login"
            >
              Acceder al panel
              <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
            Todo lo que necesitas para gestionar soporte
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-500 dark:text-zinc-400">
            Herramientas diseñadas para equipos de soporte que necesitan eficiencia y control.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, desc, paths }) => (
            <div
              className="group rounded-xl border border-zinc-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800/50"
              key={title}
            >
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                <FeaturePaths paths={paths} />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-zinc-950 dark:text-zinc-100">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-emerald-950 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ value, label }) => (
              <div key={value}>
                <p className="text-4xl font-bold text-emerald-400">{value}</p>
                <p className="mt-2 text-sm text-emerald-100/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-100">
          ¿Listo para empezar?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-zinc-500 dark:text-zinc-400">
          Accede al panel y comienza a gestionar tus tickets de soporte.
        </p>
        <div className="mt-8">
          <Link
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-600"
            to="/login"
          >
            Acceder al panel
            <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </PublicLayout>
  )
}
