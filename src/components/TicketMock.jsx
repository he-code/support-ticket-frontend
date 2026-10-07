import { Badge, Icon } from './SupportUi'
import { getPriorityMeta, getStatusMeta } from '../lib/ticket'

/**
 * Maqueta de un ticket real del producto: pieza visual de marca para las
 * vistas publicas (hero de la landing y pagina 404). Las muescas laterales
 * simulan la perforacion de un ticket fisico.
 */
export default function TicketMock({
  status = 'open',
  priority = 'high',
  code = '#TKT-2481',
  sla = '04:12',
  notFound = false,
}) {
  const statusMeta = notFound
    ? { label: 'No encontrado', tone: 'rose' }
    : getStatusMeta(status)
  const displayCode = notFound ? '#TKT-404' : code
  const priorityMeta = getPriorityMeta(priority)

  return (
    <div className="relative rounded-xl border border-border bg-surface p-5 shadow-2xl">
      {/* Muescas de perforacion */}
      <span className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-bg" />
      <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-bg" />

      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-sm font-medium tracking-wide text-muted">
          {displayCode}
        </span>
        <Badge tone={statusMeta?.tone}>{statusMeta?.label}</Badge>
      </div>

      <div className="mt-4 space-y-2">
        <div className="h-3 w-3/4 rounded bg-surface-hover" />
        <div className="h-3 w-1/2 rounded bg-surface-hover" />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-dashed border-border pt-4">
        <div className="flex items-center gap-3 text-xs text-muted">
          <Badge tone={priorityMeta?.tone}>{priorityMeta?.label}</Badge>
          <span className="inline-flex items-center gap-1.5 font-mono">
            <Icon className="h-3.5 w-3.5" name="clock" />
            SLA {sla}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-accent/20 text-[10px] font-bold text-accent">
            CV
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted">
            <Icon className="h-3.5 w-3.5" name="message" />
            3
          </span>
        </div>
      </div>
    </div>
  )
}
