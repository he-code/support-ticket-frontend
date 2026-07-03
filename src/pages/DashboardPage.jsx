import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getDashboardStats, listTickets } from '../api/support'
import { Badge, Icon, PageHeader, Panel, SkeletonRows } from '../components/SupportUi'
import {
  collectionFromPayload,
  formatDate,
  getPriorityMeta,
  getStatusMeta,
  getTicketCode,
  getTicketCreatedAt,
  getTicketTitle,
} from '../lib/support'

function StatCard({ icon, title, value, loading, tone = 'slate' }) {
  const toneClass = {
    slate: 'bg-slate-100 text-slate-700',
    sky: 'bg-sky-50 text-sky-700',
    amber: 'bg-amber-50 text-amber-700',
    emerald: 'bg-emerald-50 text-emerald-700',
  }[tone]

  return (
    <Panel className="p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <span className={`rounded-lg p-2 ${toneClass}`}>
          <Icon className="h-4 w-4" name={icon} />
        </span>
      </div>

      {loading ? (
        <div className="mt-4 h-8 w-20 animate-pulse rounded-md bg-slate-100" />
      ) : (
        <p className="mt-3 text-3xl font-bold text-zinc-950">{value}</p>
      )}
    </Panel>
  )
}

function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [recentTickets, setRecentTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadDashboard = async () => {
      setLoading(true)
      setError('')

      const [statsResult, ticketsResult] = await Promise.allSettled([
        getDashboardStats(),
        listTickets({ sort_by: 'created_at', sort_direction: 'desc' }),
      ])

      if (!isMounted) return

      if (statsResult.status === 'fulfilled') {
        setStats(statsResult.value)
      }

      if (ticketsResult.status === 'fulfilled') {
        setRecentTickets(collectionFromPayload(ticketsResult.value).slice(0, 5))
      }

      if (statsResult.status === 'rejected' && ticketsResult.status === 'rejected') {
        setError('No se pudo cargar el dashboard.')
      }

      setLoading(false)
    }

    loadDashboard()

    return () => {
      isMounted = false
    }
  }, [])

  const openTickets =
    stats?.by_status?.open ?? stats?.open_tickets ?? stats?.open ?? 0
  const inProgressTickets =
    stats?.by_status?.in_progress ??
    stats?.in_progress_tickets ??
    stats?.in_progress ??
    0
  const closedTickets =
    stats?.by_status?.closed ?? stats?.closed_tickets ?? stats?.closed ?? 0

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <>
            <Link
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              to="/tickets"
            >
              <Icon name="tickets" />
              Tickets
            </Link>
            <Link
              className="flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
              to="/tickets/create"
            >
              <Icon name="plus" />
              Nuevo ticket
            </Link>
          </>
        }
        description="Resumen operativo de la mesa de soporte."
        title="Dashboard"
      />

      {error && (
        <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon="tickets"
          loading={loading}
          title="Total tickets"
          value={stats?.total_tickets ?? stats?.total ?? recentTickets.length}
        />
        <StatCard
          icon="clock"
          loading={loading}
          title="Abiertos"
          tone="sky"
          value={openTickets}
        />
        <StatCard
          icon="refresh"
          loading={loading}
          title="En progreso"
          tone="amber"
          value={inProgressTickets}
        />
        <StatCard
          icon="check"
          loading={loading}
          title="Cerrados"
          tone="emerald"
          value={closedTickets}
        />
      </div>

      <Panel>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-zinc-950">
              Tickets recientes
            </h2>
            <p className="text-sm text-slate-500">Ultimos movimientos</p>
          </div>
          <Link
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            to="/tickets"
          >
            Ver todos
            <Icon name="arrow" />
          </Link>
        </div>

        <div className="p-5">
          {loading ? (
            <SkeletonRows rows={5} />
          ) : recentTickets.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              Sin tickets recientes.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentTickets.map((ticket) => {
                const status = getStatusMeta(ticket.status)
                const priority = getPriorityMeta(ticket.priority)

                return (
                  <Link
                    className="grid gap-3 py-4 transition hover:bg-slate-50 sm:grid-cols-[1fr_auto] sm:items-center"
                    key={ticket.id ?? ticket.uuid}
                    to={`/tickets/${ticket.id ?? ticket.uuid}`}
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        {getTicketCode(ticket)}
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold text-zinc-950">
                        {getTicketTitle(ticket)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatDate(getTicketCreatedAt(ticket))}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      <Badge tone={status.tone}>{status.label}</Badge>
                      <Badge tone={priority.tone}>{priority.label}</Badge>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </Panel>
    </div>
  )
}

export default DashboardPage
