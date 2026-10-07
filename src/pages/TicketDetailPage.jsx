import { useState } from 'react'
import { Link, useParams } from 'react-router'
import {
  addTicketComment,
  assignTicket,
  getTicket,
  listSupportAgents,
  listTicketAttachments,
  listTicketComments,
  updateTicketStatus,
  uploadTicketAttachment,
} from '../api/support'
import {
  Badge,
  EmptyState,
  Icon,
  inputClass,
  labelClass,
  PageHeader,
  Panel,
  SkeletonRows,
} from '../components/SupportUi'
import { useAsync } from '../hooks/useAsync'
import { useMutation } from '../hooks/useMutation'
import { useToast } from '../context/ToastContext'
import { collectionFromPayload } from '../lib/normalizers'
import { formatDate, getInitials } from '../lib/formatters'
import {
  getPriorityMeta,
  getStatusMeta,
  getTicketAgent,
  getTicketAgentId,
  getTicketCategory,
  getTicketCode,
  getTicketCreatedAt,
  getTicketDescription,
  getTicketRequester,
  getTicketTitle,
  personName,
} from '../lib/ticket'
import { statusOptions } from '../lib/constants'

function TicketDetailPage() {
  const { ticketId } = useParams()
  const [comment, setComment] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [attachmentKey, setAttachmentKey] = useState(0)
  const [saving, setSaving] = useState('')

  const { data: mainData, loading, error: asyncError, reload: reloadTicket } = useAsync(async () => {
    const [ticketResult, commentsResult, attachmentsResult] = await Promise.allSettled([
      getTicket(ticketId),
      listTicketComments(ticketId),
      listTicketAttachments(ticketId),
    ])

    if (ticketResult.status === 'rejected') {
      throw ticketResult.reason
    }

    const nextTicket = ticketResult.value.ticket ?? ticketResult.value

    return {
      ticket: nextTicket,
      comments:
        commentsResult.status === 'fulfilled'
          ? collectionFromPayload(commentsResult.value)
          : [],
      attachments:
        attachmentsResult.status === 'fulfilled'
          ? collectionFromPayload(attachmentsResult.value)
          : [],
      initialStatus: nextTicket.status ?? 'open',
      initialAgentId: String(getTicketAgentId(nextTicket) ?? ''),
    }
  }, [ticketId])

  const [status, setStatus] = useState('')
  const [agentId, setAgentId] = useState('')
  const [prevMainData, setPrevMainData] = useState(null)

  // Sincronizar selects con los datos del ticket en cada carga
  // (patron de ajuste durante render de la doc de React).
  if (prevMainData !== mainData) {
    setPrevMainData(mainData)
    setStatus(mainData?.initialStatus ?? '')
    setAgentId(mainData?.initialAgentId ?? '')
  }

  const ticket = mainData?.ticket ?? null
  const comments = mainData?.comments ?? []
  const attachments = mainData?.attachments ?? []
  const { data: agents = [] } = useAsync(
    async () => collectionFromPayload(await listSupportAgents({ per_page: 100 })),
    [],
  )

  const { execute } = useMutation()
  const { showToast } = useToast()

  const error = asyncError

  const requester = getTicketRequester(ticket)
  const agent = getTicketAgent(ticket)
  const ticketStatus = getStatusMeta(ticket?.status)
  const ticketPriority = getPriorityMeta(ticket?.priority)

  const saveStatus = async () => {
    setSaving('status')
    try {
      await execute(updateTicketStatus, ticketId, status)
      showToast('Estado actualizado.')
      reloadTicket()
    } catch {
      // error handled by useMutation
    } finally {
      setSaving('')
    }
  }

  const saveAssignment = async () => {
    setSaving('assignment')
    try {
      await execute(assignTicket, ticketId, agentId || null)
      showToast('Asignacion actualizada.')
      reloadTicket()
    } catch {
      // error handled by useMutation
    } finally {
      setSaving('')
    }
  }

  const submitComment = async (event) => {
    event.preventDefault()
    if (!comment.trim()) return

    setSaving('comment')
    try {
      await execute(addTicketComment, ticketId, comment.trim())
      setComment('')
      showToast('Comentario agregado.')
      reloadTicket()
    } catch {
      // error handled by useMutation
    } finally {
      setSaving('')
    }
  }

  const submitAttachment = async (event) => {
    event.preventDefault()
    if (!attachment) return

    setSaving('attachment')
    try {
      await execute(uploadTicketAttachment, ticketId, attachment)
      setAttachment(null)
      setAttachmentKey((current) => current + 1)
      showToast('Adjunto cargado.')
      reloadTicket()
    } catch {
      // error handled by useMutation
    } finally {
      setSaving('')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <Link
            className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-semibold text-muted transition hover:bg-surface-hover hover:text-text"
            to="/tickets"
          >
            <Icon name="arrow" className="h-4 w-4" />
            Volver
          </Link>
        }
        description={ticket ? getTicketCode(ticket) : 'Detalle del ticket'}
        title={ticket ? getTicketTitle(ticket) : 'Ticket'}
      />

      {error && (
        <div className="rounded-lg bg-danger/15 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {loading ? (
        <Panel className="p-5">
          <SkeletonRows rows={6} />
        </Panel>
      ) : !ticket ? (
        <EmptyState
          action={
            <Link
              className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white"
              to="/tickets"
            >
              Ir a tickets
            </Link>
          }
          description="La API no devolvio informacion para este ticket."
          title="Ticket no encontrado"
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Panel>
              <div className="border-b border-border px-5 py-4">
                <div className="flex flex-wrap gap-2">
                  <Badge tone={ticketStatus?.tone}>{ticketStatus?.label}</Badge>
                  <Badge tone={ticketPriority?.tone}>{ticketPriority?.label}</Badge>
                  <Badge tone="slate">{getTicketCategory(ticket)}</Badge>
                </div>
              </div>

              <div className="space-y-5 p-5">
                <div>
                  <p className="text-sm font-semibold text-muted">Descripcion</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-text/85">
                    {getTicketDescription(ticket) || 'Sin descripcion.'}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs font-semibold uppercase text-muted">
                      Solicitante
                    </p>
                    <p className="mt-2 text-sm font-semibold text-text">
                      {personName(requester, 'Sin solicitante')}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {requester?.email}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs font-semibold uppercase text-muted">
                      Agente
                    </p>
                    <p className="mt-2 text-sm font-semibold text-text">
                      {personName(agent)}
                    </p>
                    <p className="mt-1 text-xs text-muted">{agent?.email}</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs font-semibold uppercase text-muted">
                      Creado
                    </p>
                    <p className="mt-2 text-sm font-semibold text-text">
                      {formatDate(getTicketCreatedAt(ticket))}
                    </p>
                  </div>
                </div>
              </div>
            </Panel>

            <Panel>
              <div className="flex items-center gap-2 border-b border-border px-5 py-4">
                <Icon name="message" className="h-4 w-4" />
                <h2 className="text-base font-semibold text-text">
                  Comentarios
                </h2>
              </div>

              <div className="space-y-5 p-5">
                {comments.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
                    Sin comentarios.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((item, index) => {
                      const author = item.user ?? item.author ?? item.created_by ?? {}
                      const body =
                        item.body ?? item.message ?? item.content ?? item.text

                      return (
                        <article
                          className="flex gap-3 rounded-xl border border-border p-4"
                          key={item.id ?? index}
                        >
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-xs font-bold text-white">
                            {getInitials(personName(author, 'ST'))}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-text">
                                {personName(author, 'Usuario')}
                              </p>
                              <span className="text-xs text-muted">
                                {formatDate(item.created_at ?? item.createdAt)}
                              </span>
                            </div>
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-text/85">
                              {body}
                            </p>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                )}

                <form className="space-y-3" onSubmit={submitComment}>
                  <label className={labelClass} htmlFor="comment">
                    Nuevo comentario
                  </label>
                  <textarea
                    className={`${inputClass} min-h-28 resize-y`}
                    id="comment"
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="Escribe una respuesta..."
                    value={comment}
                  />
                  <button
                    className="flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white transition hover:bg-accent/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={saving === 'comment'}
                    type="submit"
                  >
                    <Icon name="message" className="h-4 w-4" />
                    {saving === 'comment' ? 'Enviando...' : 'Comentar'}
                  </button>
                </form>
              </div>
            </Panel>
          </div>

          <aside className="space-y-6">
            <Panel>
              <div className="border-b border-border px-5 py-4">
                <h2 className="text-base font-semibold text-text">Gestion</h2>
              </div>
              <div className="space-y-5 p-5">
                <div>
                  <label className={labelClass} htmlFor="status">
                    Estado
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <select
                      className={inputClass}
                      id="status"
                      onChange={(event) => setStatus(event.target.value)}
                      value={status}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button
                      aria-label="Guardar estado"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent text-white transition hover:bg-accent/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={saving === 'status' || !status}
                      onClick={saveStatus}
                      title="Guardar estado"
                      type="button"
                    >
                      <Icon name="save" className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelClass} htmlFor="agent">
                    Asignacion
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <select
                      className={inputClass}
                      id="agent"
                      onChange={(event) => setAgentId(event.target.value)}
                      value={agentId}
                    >
                      <option value="">Sin asignar</option>
                      {agents.map((user) => (
                        <option key={user.id} value={user.id}>
                          {personName(user)}
                        </option>
                      ))}
                    </select>
                    <button
                      aria-label="Guardar asignacion"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent text-white transition hover:bg-accent/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={saving === 'assignment'}
                      onClick={saveAssignment}
                      title="Guardar asignacion"
                      type="button"
                    >
                      <Icon name="save" className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs font-semibold uppercase text-muted">
                    Ticket ID
                  </p>
                  <p className="mt-1 font-mono text-sm text-text">
                    {getTicketCode(ticket)}
                  </p>
                </div>
              </div>
            </Panel>

            <Panel>
              <div className="flex items-center gap-2 border-b border-border px-5 py-4">
                <Icon name="paperclip" className="h-4 w-4" />
                <h2 className="text-base font-semibold text-text">Adjuntos</h2>
              </div>

              <div className="space-y-4 p-5">
                {attachments.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
                    Sin adjuntos.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {attachments.map((file, index) => {
                      const name =
                        file.name ??
                        file.filename ??
                        file.file_name ??
                        file.original_name
                      const url =
                        file.download_url ?? file.url ?? file.path ?? file.preview_url
                      const key = file.id ?? index
                      const rowClass =
                        'flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm text-muted transition hover:bg-surface-hover'

                      return url ? (
                        <a
                          className={rowClass}
                          href={url}
                          key={key}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <span className="min-w-0 truncate">{name}</span>
                          <Icon name="arrow" className="h-4 w-4 shrink-0" />
                        </a>
                      ) : (
                        <div className={rowClass} key={key}>
                          <span className="min-w-0 truncate">{name}</span>
                        </div>
                      )
                    })}
                  </div>
                )}

                <form className="space-y-3" onSubmit={submitAttachment}>
                  <label className={labelClass} htmlFor="attachment">
                    Cargar archivo
                  </label>
                  <input
                    className={inputClass}
                    id="attachment"
                    key={attachmentKey}
                    onChange={(event) =>
                      setAttachment(event.target.files?.[0] ?? null)
                    }
                    type="file"
                  />
                  <button
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!attachment || saving === 'attachment'}
                    type="submit"
                  >
                    <Icon name="upload" className="h-4 w-4" />
                    {saving === 'attachment' ? 'Cargando...' : 'Subir adjunto'}
                  </button>
                </form>
              </div>
            </Panel>
          </aside>
        </div>
      )}
    </div>
  )
}

export default TicketDetailPage