export const statusOptions = [
  { value: 'open', label: 'Abierto', tone: 'sky' },
  { value: 'in_progress', label: 'En progreso', tone: 'amber' },
  { value: 'waiting_customer', label: 'Espera cliente', tone: 'violet' },
  { value: 'waiting_internal', label: 'Espera interna', tone: 'amber' },
  { value: 'resolved', label: 'Resuelto', tone: 'emerald' },
  { value: 'closed', label: 'Cerrado', tone: 'slate' },
  { value: 'reopened', label: 'Reabierto', tone: 'rose' },
]

export const priorityOptions = [
  { value: 'low', label: 'Baja', tone: 'slate' },
  { value: 'medium', label: 'Media', tone: 'sky' },
  { value: 'high', label: 'Alta', tone: 'amber' },
  { value: 'urgent', label: 'Urgente', tone: 'rose' },
]

export const roleOptions = [
  { value: 'admin', label: 'Administrador' },
  { value: 'support_agent', label: 'Agente' },
  { value: 'user', label: 'Usuario' },
]

export function payloadFromResponse(response) {
  return response?.data?.data ?? response?.data ?? response
}

export function collectionFromPayload(payload) {
  const value = payloadFromResponse(payload)

  if (Array.isArray(value)) return value
  if (Array.isArray(value?.data)) return value.data
  if (Array.isArray(value?.items)) return value.items
  if (Array.isArray(value?.results)) return value.results
  if (Array.isArray(value?.notifications)) return value.notifications
  if (Array.isArray(value?.tickets)) return value.tickets
  if (Array.isArray(value?.users)) return value.users
  if (Array.isArray(value?.imports)) return value.imports
  if (Array.isArray(value?.support_agents)) return value.support_agents
  if (Array.isArray(value?.categories)) return value.categories
  if (Array.isArray(value?.comments)) return value.comments
  if (Array.isArray(value?.attachments)) return value.attachments

  return []
}

export function cleanParams(params) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value != null),
  )
}

export function getStatusMeta(status) {
  return (
    statusOptions.find((option) => option.value === status) ?? {
      value: status,
      label: status || 'Sin estado',
      tone: 'slate',
    }
  )
}

export function getPriorityMeta(priority) {
  return (
    priorityOptions.find((option) => option.value === priority) ?? {
      value: priority,
      label: priority || 'Sin prioridad',
      tone: 'slate',
    }
  )
}

export function getRoleLabel(role) {
  return roleOptions.find((option) => option.value === role)?.label ?? role
}

export function formatDate(value) {
  if (!value) return 'Sin fecha'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Sin fecha'

  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function getInitials(name = '') {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return initials || 'ST'
}

export function getTicketId(ticket) {
  return ticket?.id ?? ticket?.uuid ?? ticket?.ticket_id
}

export function getTicketCode(ticket) {
  const id = getTicketId(ticket)

  return (
    ticket?.code ??
    ticket?.ticket_number ??
    ticket?.number ??
    (id ? `TK-${String(id).padStart(4, '0')}` : 'Ticket')
  )
}

export function getTicketTitle(ticket) {
  return ticket?.title ?? ticket?.subject ?? ticket?.name ?? 'Sin titulo'
}

export function getTicketDescription(ticket) {
  return ticket?.description ?? ticket?.body ?? ticket?.details ?? ''
}

export function getTicketCategory(ticket) {
  return ticket?.category?.name ?? ticket?.category_name ?? 'Sin categoria'
}

export function getTicketRequester(ticket) {
  return (
    ticket?.requester ??
    ticket?.customer ??
    ticket?.created_by ??
    ticket?.creator ??
    ticket?.user ??
    {}
  )
}

export function getTicketAgent(ticket) {
  return (
    ticket?.agent ??
    ticket?.assigned_agent ??
    ticket?.assigned_user ??
    ticket?.assigned_to ??
    ticket?.assignee ??
    {}
  )
}

export function getTicketAgentId(ticket) {
  const raw =
    ticket?.agent_id ??
    ticket?.assigned_agent_id ??
    ticket?.assigned_to_id ??
    ticket?.assigned_to ??
    ticket?.agent?.id ??
    ticket?.assignee?.id

  return typeof raw === 'object' ? raw?.id : raw
}

export function personName(person, fallback = 'Sin asignar') {
  return person?.name ?? person?.full_name ?? person?.email ?? fallback
}

export function getTicketCreatedAt(ticket) {
  return ticket?.created_at ?? ticket?.createdAt ?? ticket?.date
}
