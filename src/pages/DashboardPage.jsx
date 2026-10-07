import { Link } from 'react-router'
import { getDashboardStats, listTickets } from '../api/support'
import { Badge, Icon, PageHeader, Panel, SkeletonRows } from '../components/SupportUi'
import { useAsync } from '../hooks/useAsync'
import { collectionFromPayload } from '../lib/normalizers'
import { formatDate } from '../lib/formatters'
import {
  getPriorityMeta,
  getStatusMeta,
  getTicketCode,
  getTicketCreatedAt,
  getTicketTitle,
} from '../lib/ticket'

function StatCard({ icon, title, value, loading, tone = 'slate' }) {
  const toneBg = {
    slate: 'bg-muted/10',
    violet: 'bg-accent/10',
    amber: 'bg-warning/10',
    indigo: 'bg-success/10',
  }
  const toneText = {
    slate: 'text-muted',
    violet: 'text-accent',
    amber: 'text-warning',
    indigo: 'text-success',
  }

  return (
    <Panel className="p-5 transition-all duration-200 hover:border-accent/30 hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted">{title}</p>
        <span className={`rounded-lg p-2 ${toneBg[tone] || toneBg.slate} ${toneText[tone] || toneText.slate}`}>
          <Icon className="h-4 w-4" name={icon} />
        </span>
      </div>

      {loading ? (
        <div className="mt-4 h-8 w-20 rounded-md skeleton-shimmer" />
      ) : (
        <p className="mt-3 text-3xl font-bold text-text">{value}</p>
      )}
    </Panel>
  )
}

function DashboardPage() {
  const { data, loading } = useAsync(async () => {
    const [statsResult, ticketsResult] = await Promise.allSettled([
      getDashboardStats(),
      listTickets({ sort_by: 'created_at', sort_direction: 'desc' }),
    ])

    const stats = statsResult.status === 'fulfilled' ? statsResult.value : null
    const tickets = ticketsResult.status === 'fulfilled'
      ? collectionFromPayload(ticketsResult.value).slice(0, 5)
      : []

    const errorMessage =
      statsResult.status === 'rejected' && ticketsResult.status === 'rejected'
        ? 'No se pudo cargar el dashboard.'
        : null

    const notice =
      statsResult.status === 'rejected' && ticketsResult.status === 'fulfilled'
        ? 'Estadisticas no disponibles.'
        : null

    return { stats, tickets, error: errorMessage, notice }
  }, [])

  const stats = data?.stats ?? null
  const recentTickets = data?.tickets ?? []
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
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-semibold text-text transition hover:bg-surface-hover"
              to="/tickets"
            >
              <Icon name="tickets" className="h-4 w-4" />
              Ver todos
            </Link>
            <Link
              className="flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white transition hover:bg-accent/90 active:scale-[0.98]"
              to="/tickets/create"
            >
              <Icon name="plus" className="h-4 w-4" />
              Nuevo ticket
            </Link>
          </>
        }
        description="Resumen operativo de la mesa de soporte."
        title="Dashboard"
      />

      {data?.error && (
        <div className="rounded-lg bg-danger/15 px-4 py-3 text-sm text-danger">
          {data.error}
        </div>
      )}

      {data?.notice && (
        <div className="rounded-lg bg-warning/15 px-4 py-3 text-sm text-warning">
          {data.notice}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon="tickets"
          loading={loading}
          title="Total tickets"
          value={stats?.total_tickets ?? stats?.total ?? '—'}
        />
        <StatCard
          icon="clock"
          loading={loading}
          title="Abiertos"
          tone="violet"
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
          tone="indigo"
          value={closedTickets}
        />
      </div>

      <Panel>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-text">Tickets recientes</h2>
            <p className="text-sm text-muted">Ultimos movimientos</p>
          </div>
          <Link
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted transition hover:bg-surface-hover hover:text-text"
            to="/tickets"
          >
            Ver todos
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>

        <div className="p-5">
          {loading ? (
            <SkeletonRows rows={5} />
          ) : recentTickets.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted">
              Sin tickets recientes.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentTickets.map((ticket) => {
                const status = getStatusMeta(ticket.status)
                const priority = getPriorityMeta(ticket.priority)

                return (
                  <Link
                    className="grid gap-3 py-4 transition hover:bg-surface-hover/50 sm:grid-cols-[1fr_auto] sm:items-center"
                    key={ticket.id ?? ticket.uuid}
                    to={`/tickets/${ticket.id ?? ticket.uuid}`}
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase text-muted font-mono">
                        {getTicketCode(ticket)}
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold text-text">
                        {getTicketTitle(ticket)}
                      </p>
                      <p className="mt-1 text-xs text-muted">
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