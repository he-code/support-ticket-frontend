import { Link } from 'react-router'
import PublicLayout from '../components/PublicLayout'
import TicketMock from '../components/TicketMock'
import {
  buttonGhostClass,
  buttonPrimaryClass,
  Icon,
} from '../components/SupportUi'

const features = [
  {
    title: 'Gestión de tickets',
    desc: 'Seguimiento, estados y prioridades, con el historial completo de cada conversación.',
    icon: 'tickets',
  },
  {
    title: 'SLA y prioridades',
    desc: 'Tiempos de respuesta por nivel de urgencia, para que nada se quede sin respuesta.',
    icon: 'shield',
  },
  {
    title: 'Equipo colaborativo',
    desc: 'Asignaciones, comentarios y notificaciones para que todo el equipo avance junto.',
    icon: 'users',
  },
]

export default function LandingPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bg px-4 sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[720px] -translate-x-1/2 rounded-full opacity-25 blur-3xl bg-[radial-gradient(circle,_var(--color-accent)_0%,_var(--color-accent-2)_55%,_transparent_75%)] lg:left-auto lg:right-0 lg:translate-x-1/4"
        />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 py-20 lg:min-h-[calc(100vh-7rem)] lg:grid-cols-2 lg:py-24">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
              Plataforma de soporte
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-text sm:text-5xl lg:text-6xl">
              Mesa de soporte que no se queda atrás.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
              Recibe, clasifica y resuelve tickets con tu equipo en una sola
              consola: prioridades, SLA, asignaciones y un historial completo
              por conversación.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link className={buttonPrimaryClass} to="/login">
                Entrar al panel
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <a className={buttonGhostClass} href="#capacidades">
                Ver capacidades
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
            <TicketMock className="rotate-[-2deg]" />
          </div>
        </div>
      </section>

      <div aria-hidden="true" className="hairline-gradient" />

      {/* Capacidades */}
      <section className="bg-bg px-4 py-24 sm:px-6 lg:px-8" id="capacidades">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Capacidades
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-text">
            Todo lo que necesitas para gestionar el soporte
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Herramientas diseñadas para equipos que necesitan velocidad y control.
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ title, desc, icon }) => (
              <div
                className="group rounded-xl border border-border bg-surface p-8 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg"
                key={title}
              >
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-accent-soft text-accent">
                  <Icon className="h-6 w-6" name={icon} />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-text">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div aria-hidden="true" className="hairline-gradient" />

      {/* CTA final */}
      <section className="relative overflow-hidden bg-bg px-4 py-24 text-center sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl bg-[radial-gradient(circle,_var(--color-accent)_0%,_var(--color-accent-2)_55%,_transparent_75%)]"
        />
        <div className="relative z-10 mx-auto max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Acceso
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-text">
            ¿Listo para empezar?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted">
            Accede al panel y comienza a gestionar tus tickets de soporte.
          </p>
          <div className="mt-8">
            <Link className={buttonPrimaryClass} to="/login">
              Acceder al panel
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
