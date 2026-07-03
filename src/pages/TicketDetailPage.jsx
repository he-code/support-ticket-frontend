import { useCallback, useEffect, useState } from 'react'
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
import {
  collectionFromPayload,
  formatDate,
  getInitials,
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
  statusOptions,
} from '../lib/support'

function TicketDetailPage() {
  const { ticketId } = useParams()
  const [ticket, setTicket] = useState(null)
  const [comments, setComments] = useState([])
  const [attachments, setAttachments] = useState([])
  const [agents, setAgents] = useState([])
  const [status, setStatus] = useState('')
  const [agentId, setAgentId] = useState('')
  const [comment, setComment] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [attachmentKey, setAttachmentKey] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadTicket = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [ticketData, commentsData, attachmentsData] = await Promise.all([
        getTicket(ticketId),
        listTicketComments(ticketId),
        listTicketAttachments(ticketId),
      ])
      const nextTicket = ticketData.ticket ?? ticketData

      setTicket(nextTicket)
      setComments(collectionFromPayload(commentsData))
      setAttachments(collectionFromPayload(attachmentsData))
      setStatus(nextTicket.status ?? 'open')
      setAgentId(String(getTicketAgentId(nextTicket) ?? ''))
    } catch {
      setError('No se pudo cargar el ticket.')
    } finally {
      setLoading(false)
    }
  }, [ticketId])

  const loadAgents = useCallback(async () => {
    try {
      const data = await listSupportAgents()
      const users = collectionFromPayload(data)

      setAgents(users)
    } catch {
      setAgents([])
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    Promise.resolve().then(() => {
      if (!cancelled) {
        loadTicket()
        loadAgents()
      }
    })

    return () => {
      cancelled = true
    }
  }, [loadAgents, loadTicket])

  const requester = getTicketRequester(ticket)
  const agent = getTicketAgent(ticket)
  const ticketStatus = getStatusMeta(ticket?.status)
  const ticketPriority = getPriorityMeta(ticket?.priority)

  const saveStatus = async () => {
    setSaving('status')
    setNotice('')

    try {
      await updateTicketStatus(ticketId, status)
      setNotice('Estado actualizado.')
      await loadTicket()
    } catch {
      setError('No se pudo actualizar el estado.')
    } finally {
      setSaving('')
    }
  }

  const saveAssignment = async () => {
    setSaving('assignment')
    setNotice('')

    try {
      await assignTicket(ticketId, agentId || null)
      setNotice('Asignacion actualizada.')
      await loadTicket()
    } catch {
      setError('No se pudo actualizar la asignacion.')
    } finally {
      setSaving('')
    }
  }

  const submitComment = async (event) => {
    event.preventDefault()
    if (!comment.trim()) return

    setSaving('comment')
    setNotice('')

    try {
      await addTicketComment(ticketId, comment.trim())
      setComment('')
      setNotice('Comentario agregado.')
      await loadTicket()
    } catch {
      setError('No se pudo agregar el comentario.')
    } finally {
      setSaving('')
    }
  }

  const submitAttachment = async (event) => {
    event.preventDefault()
    if (!attachment) return

    setSaving('attachment')
    setNotice('')

    try {
      await uploadTicketAttachment(ticketId, attachment)
      setAttachment(null)
      setAttachmentKey((current) => current + 1)
      setNotice('Adjunto cargado.')
      await loadTicket()
    } catch {
      setError('No se pudo cargar el adjunto.')
    } finally {
      setSaving('')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <Link
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            to="/tickets"
          >
            <Icon name="arrow" />
            Volver
          </Link>
        }
        description={ticket ? getTicketCode(ticket) : 'Detalle del ticket'}
        title={ticket ? getTicketTitle(ticket) : 'Ticket'}
      />

      {notice && (
        <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {notice}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
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
              className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white"
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
              <div className="border-b border-slate-200 px-5 py-4">
                <div className="flex flex-wrap gap-2">
                  <Badge tone={ticketStatus.tone}>{ticketStatus.label}</Badge>
                  <Badge tone={ticketPriority.tone}>{ticketPriority.label}</Badge>
                  <Badge tone="slate">{getTicketCategory(ticket)}</Badge>
                </div>
              </div>

              <div className="space-y-5 p-5">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Descripcion
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {getTicketDescription(ticket) || 'Sin descripcion.'}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Solicitante
                    </p>
                    <p className="mt-2 text-sm font-semibold text-zinc-950">
                      {personName(requester, 'Sin solicitante')}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {requester?.email}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Agente
                    </p>
                    <p className="mt-2 text-sm font-semibold text-zinc-950">
                      {personName(agent)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{agent?.email}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Creado
                    </p>
                    <p className="mt-2 text-sm font-semibold text-zinc-950">
                      {formatDate(getTicketCreatedAt(ticket))}
                    </p>
                  </div>
                </div>
              </div>
            </Panel>

            <Panel>
              <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
                <Icon name="message" />
                <h2 className="text-base font-semibold text-zinc-950">
                  Comentarios
                </h2>
              </div>

              <div className="space-y-5 p-5">
                {comments.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
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
                          className="flex gap-3 rounded-lg border border-slate-200 p-4"
                          key={item.id ?? index}
                        >
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-700 text-xs font-bold text-white">
                            {getInitials(personName(author, 'ST'))}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-zinc-950">
                                {personName(author, 'Usuario')}
                              </p>
                              <span className="text-xs text-slate-400">
                                {formatDate(item.created_at ?? item.createdAt)}
                              </span>
                            </div>
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
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
                    placeholder="Escribe una respuesta"
                    value={comment}
                  />
                  <button
                    className="flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={saving === 'comment'}
                    type="submit"
                  >
                    <Icon name="message" />
                    {saving === 'comment' ? 'Enviando...' : 'Comentar'}
                  </button>
                </form>
              </div>
            </Panel>
          </div>

          <aside className="space-y-6">
            <Panel>
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-base font-semibold text-zinc-950">
                  Gestion
                </h2>
              </div>
              <div className="space-y-5 p-5">
                <div>
                  <label className={labelClass} htmlFor="status">
                    Estado
                  </label>
                  <div className="mt-1 flex gap-2">
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
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-700 text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={saving === 'status'}
                      onClick={saveStatus}
                      title="Guardar estado"
                      type="button"
                    >
                      <Icon name="save" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelClass} htmlFor="agent">
                    Asignacion
                  </label>
                  <div className="mt-1 flex gap-2">
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
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-700 text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={saving === 'assignment'}
                      onClick={saveAssignment}
                      title="Guardar asignacion"
                      type="button"
                    >
                      <Icon name="save" />
                    </button>
                  </div>
                </div>
              </div>
            </Panel>

            <Panel>
              <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
                <Icon name="paperclip" />
                <h2 className="text-base font-semibold text-zinc-950">
                  Adjuntos
                </h2>
              </div>

              <div className="space-y-4 p-5">
                {attachments.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
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

                      return (
                        <a
                          className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                          href={url || '#'}
                          key={file.id ?? index}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <span className="min-w-0 truncate">{name}</span>
                          <Icon className="h-4 w-4 shrink-0" name="arrow" />
                        </a>
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
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!attachment || saving === 'attachment'}
                    type="submit"
                  >
                    <Icon name="upload" />
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
