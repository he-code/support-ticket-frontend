import { useState } from 'react'
import { Link } from 'react-router'
import { listCategories, listTickets } from '../api/support'
import {
  Badge,
  EmptyState,
  Icon,
  inputClass,
  PageHeader,
  Panel,
  SkeletonRows,
} from '../components/SupportUi'
import PaginationBar from '../components/PaginationBar'
import { useAsync } from '../hooks/useAsync'
import { cleanParams, paginationFromPayload } from '../lib/normalizers'
import { formatDate } from '../lib/formatters'
import {
  getPriorityMeta,
  getStatusMeta,
  getTicketAgent,
  getTicketCategory,
  getTicketCode,
  getTicketCreatedAt,
  getTicketId,
  getTicketRequester,
  getTicketTitle,
  personName,
} from '../lib/ticket'
import { priorityOptions, statusOptions } from '../lib/constants'

function TicketsPage() {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    category_id: '',
  })
  const [page, setPage] = useState(1)

  const { data: paged, loading, error } = useAsync(
    async () => {
      const params = { ...cleanParams(filters), page, per_page: 15 }
      return paginationFromPayload(await listTickets(params))
    },
    [JSON.stringify(filters), page],
  )

  const tickets = paged?.items ?? []
  const total = paged?.meta?.total ?? 0
  const totalPages = Math.ceil(total / 15)

  const { data: categories = [] } = useAsync(
    async () => paginationFromPayload(await listCategories()).items,
    [],
  )

  const handleFilterChange = (event) => {
    setPage(1)
    setFilters((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const setPillFilter = (name, value) => {
    setPage(1)
    setFilters((current) => ({
      ...current,
      [name]: current[name] === value ? '' : value,
    }))
  }

  const resetFilters = () => {
    setPage(1)
    setFilters({
      search: '',
      status: '',
      priority: '',
      category_id: '',
    })
  }

  const activeFilters = Object.values(filters).filter(Boolean).length > 0

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <Link
            className="flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white transition hover:bg-accent/90 active:scale-[0.98]"
            to="/tickets/create"
          >
            <Icon name="plus" className="h-4 w-4" />
            Nuevo ticket
          </Link>
        }
        description="Listado general con filtros por estado, prioridad y categoria."
        title="Tickets"
      />

      <Panel className="p-4 space-y-4">
        <div className="relative">
          <Icon
            className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted"
            name="search"
          />
          <input
            className={`${inputClass} pl-9`}
            name="search"
            onChange={handleFilterChange}
            placeholder="Buscar ticket..."
            type="search"
            value={filters.search}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              !filters.status
                ? 'bg-accent/15 text-accent'
                : 'bg-surface-hover text-muted hover:text-text'
            }`}
            onClick={() => setPillFilter('status', '')}
            type="button"
          >
            Todos los estados
          </button>
          {statusOptions.map((status) => (
            <button
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                filters.status === status.value
                  ? 'bg-accent/15 text-accent'
                  : 'bg-surface-hover text-muted hover:text-text'
              }`}
              key={status.value}
              onClick={() => setPillFilter('status', status.value)}
              type="button"
            >
              {status.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              !filters.priority
                ? 'bg-accent/15 text-accent'
                : 'bg-surface-hover text-muted hover:text-text'
            }`}
            onClick={() => setPillFilter('priority', '')}
            type="button"
          >
            Todas las prioridades
          </button>
          {priorityOptions.map((priority) => (
            <button
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                filters.priority === priority.value
                  ? 'bg-accent/15 text-accent'
                  : 'bg-surface-hover text-muted hover:text-text'
              }`}
              key={priority.value}
              onClick={() => setPillFilter('priority', priority.value)}
              type="button"
            >
              {priority.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              !filters.category_id
                ? 'bg-accent/15 text-accent'
                : 'bg-surface-hover text-muted hover:text-text'
            }`}
            onClick={() => setPillFilter('category_id', '')}
            type="button"
          >
            Todas las categorias
          </button>
          {categories.map((category) => (
            <button
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                filters.category_id === String(category.id)
                  ? 'bg-accent/15 text-accent'
                  : 'bg-surface-hover text-muted hover:text-text'
              }`}
              key={category.id}
              onClick={() => setPillFilter('category_id', String(category.id))}
              type="button"
            >
              {category.name}
            </button>
          ))}
        </div>

        {activeFilters && (
          <button
            className="flex items-center gap-1.5 text-xs text-muted transition hover:text-text"
            onClick={resetFilters}
            type="button"
          >
            <Icon name="x" className="h-3 w-3" />
            Limpiar filtros
          </button>
        )}
      </Panel>

      {error && (
        <div className="rounded-lg bg-danger/15 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <Panel>
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-text">{total} tickets</h2>
        </div>

        <div className="p-5">
          {loading ? (
            <SkeletonRows rows={6} />
          ) : tickets.length === 0 ? (
            <EmptyState
              action={
                <Link
                  className="flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white transition hover:bg-accent/90"
                  to="/tickets/create"
                >
                  <Icon name="plus" className="h-4 w-4" />
                  Crear ticket
                </Link>
              }
              description="No se encontraron tickets con los filtros actuales."
              title="Sin tickets"
            />
          ) : (
            <>
            <div className="space-y-3 md:hidden">
              {tickets.map((ticket) => {
                const status = getStatusMeta(ticket.status)
                const priority = getPriorityMeta(ticket.priority)
                const ticketId = getTicketId(ticket)

                return (
                  <Link
                    className="block rounded-xl border border-border bg-surface p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-md"
                    key={ticketId}
                    to={`/tickets/${ticketId}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-mono text-xs font-semibold text-muted">
                          {getTicketCode(ticket)}
                        </p>
                        <p className="mt-1 line-clamp-2 font-semibold text-text">
                          {getTicketTitle(ticket)}
                        </p>
                      </div>
                      <Icon className="h-4 w-4 shrink-0 text-accent" name="arrow" />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge tone={status.tone}>{status.label}</Badge>
                      <Badge tone={priority.tone}>{priority.label}</Badge>
                      <Badge tone="slate">{getTicketCategory(ticket)}</Badge>
                    </div>

                    <div className="mt-4 grid gap-3 text-xs text-muted">
                      <p>
                        Solicitante:{' '}
                        <span className="font-semibold text-text">
                          {personName(getTicketRequester(ticket), 'Sin solicitante')}
                        </span>
                      </p>
                      <p>
                        Agente:{' '}
                        <span className="font-semibold text-text">
                          {personName(getTicketAgent(ticket))}
                        </span>
                      </p>
                      <p>{formatDate(getTicketCreatedAt(ticket))}</p>
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase text-muted">
                    <th className="px-3 py-3">Ticket</th>
                    <th className="px-3 py-3">Estado</th>
                    <th className="px-3 py-3">Prioridad</th>
                    <th className="px-3 py-3">Solicitante</th>
                    <th className="px-3 py-3">Agente</th>
                    <th className="px-3 py-3">Fecha</th>
                    <th className="px-3 py-3 text-right">Detalle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tickets.map((ticket) => {
                    const status = getStatusMeta(ticket.status)
                    const priority = getPriorityMeta(ticket.priority)
                    const ticketId = getTicketId(ticket)

                    return (
                      <tr className="align-top hover:bg-surface-hover/50" key={ticketId}>
                        <td className="max-w-sm px-3 py-4">
                          <p className="font-mono text-xs font-semibold text-muted">
                            {getTicketCode(ticket)}
                          </p>
                          <p className="mt-1 font-semibold text-text">
                            {getTicketTitle(ticket)}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            {getTicketCategory(ticket)}
                          </p>
                        </td>
                        <td className="px-3 py-4">
                          <Badge tone={status.tone}>{status.label}</Badge>
                        </td>
                        <td className="px-3 py-4">
                          <Badge tone={priority.tone}>{priority.label}</Badge>
                        </td>
                        <td className="px-3 py-4 text-muted">
                          {personName(getTicketRequester(ticket), 'Sin solicitante')}
                        </td>
                        <td className="px-3 py-4 text-muted">
                          {personName(getTicketAgent(ticket))}
                        </td>
                        <td className="px-3 py-4 text-muted">
                          {formatDate(getTicketCreatedAt(ticket))}
                        </td>
                        <td className="px-3 py-4 text-right">
                          <Link
                            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted transition hover:bg-surface-hover hover:text-text"
                            to={`/tickets/${ticketId}`}
                          >
                            Abrir
                            <Icon name="arrow" className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

              <PaginationBar
                onPageChange={setPage}
                page={page}
                total={total}
                totalPages={totalPages}
              />
            </>
          )}
        </div>
      </Panel>
    </div>
  )
}

export default TicketsPage