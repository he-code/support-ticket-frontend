import { Link } from 'react-router'
import PublicLayout from '../components/PublicLayout'
import { Icon } from '../components/SupportUi'

const features = [
  {
    title: 'Gestion de Tickets',
    desc: 'Seguimiento, estados, prioridades y comentarios en un solo lugar.',
    icon: 'tickets',
  },
  {
    title: 'SLA y Prioridades',
    desc: 'Define tiempos de respuesta por nivel de urgencia y mantén el control.',
    icon: 'shield',
  },
  {
    title: 'Equipo Colaborativo',
    desc: 'Agentes, asignaciones y notificaciones en tiempo real.',
    icon: 'users',
  },
]

export default function LandingPage() {
  return (
    <PublicLayout>
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-bg px-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-accent-soft)_0%,_transparent_60%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            Plataforma de gestion
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-text sm:text-5xl lg:text-6xl">
            Soporte ordenado para clientes, agentes y administradores.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted">
            Tickets, comentarios, adjuntos, estados, asignaciones y usuarios en una sola consola operativa.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-bold text-white shadow-lg shadow-accent/20 transition hover:bg-accent/90 active:scale-95"
              to="/login"
            >
              Acceder al panel
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-bg px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-text">
              Todo lo que necesitas para gestionar soporte
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted">
              Herramientas disenadas para equipos de soporte que necesitan eficiencia y control.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ title, desc, icon }) => (
              <div
                className="group rounded-xl border border-border bg-surface p-8 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-md"
                key={title}
              >
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-accent/10 text-accent">
                  <Icon className="h-6 w-6" name={icon} />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-text">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bg px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold tracking-tight text-text">
            Listo para empezar?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Accede al panel y comienza a gestionar tus tickets de soporte.
          </p>
          <div className="mt-8">
            <Link
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-accent/90 active:scale-95"
              to="/login"
            >
              Acceder al panel
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}