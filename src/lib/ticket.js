import { statusOptions, priorityOptions, roleOptions } from './constants'

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
