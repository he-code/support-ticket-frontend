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
  const [status, setStatus] = useState('')
  const [agentId, setAgentId] = useState('')
  const [comment, setComment] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [attachmentKey, setAttachmentKey] = useState(0)
  const [saving, setSaving] = useState('')

  const { data: mainData, loading, error: asyncError, reload: reloadTicket } = useAsync(async () => {
    const [ticketData, commentsData, attachmentsData] = await Promise.all([
      getTicket(ticketId),
      listTicketComments(ticketId),
      listTicketAttachments(ticketId),
    ])
    const nextTicket = ticketData.ticket ?? ticketData

    return {
      ticket: nextTicket,
      comments: collectionFromPayload(commentsData),
      attachments: collectionFromPayload(attachmentsData),
      initialStatus: nextTicket.status ?? 'open',
      initialAgentId: String(getTicketAgentId(nextTicket) ?? ''),
    }
  }, [ticketId])

  const ticket = mainData?.ticket ?? null
  const comments = mainData?.comments ?? []
  const attachments = mainData?.attachments ?? []
  const { data: agents = [] } = useAsync(
    async () => collectionFromPayload(await listSupportAgents()),
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
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            to="/tickets"
          >
            <Icon name="arrow" />
            Volver
          </Link>
        }
        description={ticket ? getTicketCode(ticket) : 'Detalle del ticket'}
        title={ticket ? getTicketTitle(ticket) : 'Ticket'}
      />

      {error && (
        <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-900/50 dark:text-rose-200">
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
              className="rounded-lg bg-indigo-700 px-3 py-2 text-sm font-semibold text-white"
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
              <div className="border-b border-slate-200 px-5 py-4 dark:border-zinc-700">
                <div className="flex flex-wrap gap-2">
                  <Badge tone={ticketStatus.tone}>{ticketStatus.label}</Badge>
                  <Badge tone={ticketPriority.tone}>{ticketPriority.label}</Badge>
                  <Badge tone="slate">{getTicketCategory(ticket)}</Badge>
                </div>
              </div>

              <div className="space-y-5 p-5">
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
                    Descripcion
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-zinc-300">
                    {getTicketDescription(ticket) || 'Sin descripcion.'}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-slate-200 p-4 dark:border-zinc-700">
                    <p className="text-xs font-semibold uppercase text-slate-400 dark:text-zinc-500">
                      Solicitante
                    </p>
                    <p className="mt-2 text-sm font-semibold text-zinc-950 dark:text-zinc-100">
                      {personName(requester, 'Sin solicitante')}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                      {requester?.email}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-4 dark:border-zinc-700">
                    <p className="text-xs font-semibold uppercase text-slate-400 dark:text-zinc-500">
                      Agente
                    </p>
                    <p className="mt-2 text-sm font-semibold text-zinc-950 dark:text-zinc-100">
                      {personName(agent)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">{agent?.email}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-4 dark:border-zinc-700">
                    <p className="text-xs font-semibold uppercase text-slate-400 dark:text-zinc-500">
                      Creado
                    </p>
                    <p className="mt-2 text-sm font-semibold text-zinc-950 dark:text-zinc-100">
                      {formatDate(getTicketCreatedAt(ticket))}
                    </p>
                  </div>
                </div>
              </div>
            </Panel>

            <Panel>
              <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4 dark:border-zinc-700">
                <Icon name="message" />
                <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-100">
                  Comentarios
                </h2>
              </div>

              <div className="space-y-5 p-5">
                {comments.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-zinc-600 dark:text-zinc-400">
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
                          className="flex gap-3 rounded-lg border border-slate-200 p-4 dark:border-zinc-700"
                          key={item.id ?? index}
                        >
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-700 text-xs font-bold text-white">
                            {getInitials(personName(author, 'ST'))}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">
                                {personName(author, 'Usuario')}
                            </p>
                            <span className="text-xs text-slate-400 dark:text-zinc-500">
                                {formatDate(item.created_at ?? item.createdAt)}
                              </span>
                            </div>
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-zinc-300">
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
                    className="flex items-center gap-2 rounded-lg bg-indigo-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-700"
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
              <div className="border-b border-slate-200 px-5 py-4 dark:border-zinc-700">
                <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-100">
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
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-indigo-700 text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-700"
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
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-indigo-700 text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-700"
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
              <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4 dark:border-zinc-700">
                <Icon name="paperclip" />
                <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-100">
                  Adjuntos
                </h2>
              </div>

              <div className="space-y-4 p-5">
                {attachments.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-zinc-600 dark:text-zinc-400">
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
                          className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
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
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
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



