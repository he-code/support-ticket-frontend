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
