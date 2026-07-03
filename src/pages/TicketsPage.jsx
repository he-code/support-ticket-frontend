import { useCallback, useEffect, useState } from 'react'
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
import {
  cleanParams,
  collectionFromPayload,
  formatDate,
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
  priorityOptions,
  statusOptions,
} from '../lib/support'

function TicketsPage() {
  const [tickets, setTickets] = useState([])
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    category_id: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTickets = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await listTickets(cleanParams(filters))
      setTickets(collectionFromPayload(data))
    } catch {
      setError('No se pudieron cargar los tickets.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    let cancelled = false

    Promise.resolve().then(() => {
      if (!cancelled) loadTickets()
    })

    return () => {
      cancelled = true
    }
  }, [loadTickets])

  useEffect(() => {
    let isMounted = true

    const loadCategories = async () => {
      try {
        const data = await listCategories()

        if (isMounted) {
          setCategories(collectionFromPayload(data))
        }
      } catch {
        if (isMounted) {
          setCategories([])
        }
      }
    }

    loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

  const handleFilterChange = (event) => {
    setFilters((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      status: '',
      priority: '',
      category_id: '',
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <Link
            className="flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
            to="/tickets/create"
          >
            <Icon name="plus" />
            Nuevo ticket
          </Link>
        }
        description="Listado general con filtros por estado, prioridad y categoria."
        title="Tickets"
      />

      <Panel className="p-4">
        <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
          <div className="relative">
            <Icon
              className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400"
              name="search"
            />
            <input
              className={`${inputClass} pl-9`}
              name="search"
              onChange={handleFilterChange}
              placeholder="Buscar ticket"
              type="search"
              value={filters.search}
            />
          </div>

          <select
            className={inputClass}
            name="status"
            onChange={handleFilterChange}
            value={filters.status}
          >
            <option value="">Todos los estados</option>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <select
            className={inputClass}
            name="priority"
            onChange={handleFilterChange}
            value={filters.priority}
          >
            <option value="">Todas las prioridades</option>
            {priorityOptions.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>

          <select
            className={inputClass}
            name="category_id"
            onChange={handleFilterChange}
            value={filters.category_id}
          >
            <option value="">Todas las categorias</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <button
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={resetFilters}
            type="button"
          >
            <Icon name="filter" />
            Limpiar
          </button>
        </div>
      </Panel>

      {error && (
        <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <Panel>
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-zinc-950">
            {tickets.length} tickets
          </h2>
        </div>

        <div className="p-5">
          {loading ? (
            <SkeletonRows rows={6} />
          ) : tickets.length === 0 ? (
            <EmptyState
              action={
                <Link
                  className="flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  to="/tickets/create"
                >
                  <Icon name="plus" />
                  Crear ticket
                </Link>
              }
              description="Cuando la API devuelva tickets apareceran en esta tabla."
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
                    className="block rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50/30"
                    key={ticketId}
                    to={`/tickets/${ticketId}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase text-zinc-400">
                          {getTicketCode(ticket)}
                        </p>
                        <p className="mt-1 line-clamp-2 font-semibold text-zinc-950">
                          {getTicketTitle(ticket)}
                        </p>
                      </div>
                      <Icon className="h-4 w-4 shrink-0 text-emerald-700" name="arrow" />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge tone={status.tone}>{status.label}</Badge>
                      <Badge tone={priority.tone}>{priority.label}</Badge>
                      <Badge tone="slate">{getTicketCategory(ticket)}</Badge>
                    </div>

                    <div className="mt-4 grid gap-3 text-xs text-zinc-500">
                      <p>
                        Solicitante:{' '}
                        <span className="font-semibold text-zinc-700">
                          {personName(getTicketRequester(ticket), 'Sin solicitante')}
                        </span>
                      </p>
                      <p>
                        Agente:{' '}
                        <span className="font-semibold text-zinc-700">
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
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase text-slate-500">
                    <th className="px-3 py-3">Ticket</th>
                    <th className="px-3 py-3">Estado</th>
                    <th className="px-3 py-3">Prioridad</th>
                    <th className="px-3 py-3">Solicitante</th>
                    <th className="px-3 py-3">Agente</th>
                    <th className="px-3 py-3">Fecha</th>
                    <th className="px-3 py-3 text-right">Detalle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tickets.map((ticket) => {
                    const status = getStatusMeta(ticket.status)
                    const priority = getPriorityMeta(ticket.priority)
                    const ticketId = getTicketId(ticket)

                    return (
                      <tr className="align-top hover:bg-slate-50" key={ticketId}>
                        <td className="max-w-sm px-3 py-4">
                          <p className="text-xs font-semibold uppercase text-slate-400">
                            {getTicketCode(ticket)}
                          </p>
                          <p className="mt-1 font-semibold text-zinc-950">
                            {getTicketTitle(ticket)}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {getTicketCategory(ticket)}
                          </p>
                        </td>
                        <td className="px-3 py-4">
                          <Badge tone={status.tone}>{status.label}</Badge>
                        </td>
                        <td className="px-3 py-4">
                          <Badge tone={priority.tone}>{priority.label}</Badge>
                        </td>
                        <td className="px-3 py-4 text-slate-600">
                          {personName(getTicketRequester(ticket), 'Sin solicitante')}
                        </td>
                        <td className="px-3 py-4 text-slate-600">
                          {personName(getTicketAgent(ticket))}
                        </td>
                        <td className="px-3 py-4 text-slate-500">
                          {formatDate(getTicketCreatedAt(ticket))}
                        </td>
                        <td className="px-3 py-4 text-right">
                          <Link
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            to={`/tickets/${ticketId}`}
                          >
                            Abrir
                            <Icon name="arrow" />
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            </>
          )}
        </div>
      </Panel>
    </div>
  )
}

export default TicketsPage
