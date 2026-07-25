import * as req from './request'
import { apiRoutes, routeWithId } from '../config/apiRoutes'
import { getTicketId } from '../lib/ticket'

export function getDashboardStats() {
  return req.get(apiRoutes.dashboardStats)
}

export function listTickets(params = {}) {
  return req.get(apiRoutes.tickets, { params })
}

export function getTicket(ticketId) {
  return req.get(routeWithId(apiRoutes.tickets, ticketId))
}

export async function createTicket(payload, attachments = []) {
  const created = await req.post(apiRoutes.tickets, payload)
  const ticket = created.ticket ?? created
  const id = getTicketId(ticket)

  if (id && attachments.length > 0) {
    await Promise.all(attachments.map((file) => uploadTicketAttachment(id, file)))
  }

  return created
}

export async function updateTicketStatus(ticketId, status) {
  try {
    return await req.patch(`${routeWithId(apiRoutes.tickets, ticketId)}/status`, { status })
  } catch (error) {
    if ([404, 405].includes(error.response?.status)) {
      return req.patch(routeWithId(apiRoutes.tickets, ticketId), { status })
    }

    throw error
  }
}

export async function assignTicket(ticketId, agentId) {
  const payload = { assigned_to_id: agentId || null }

  try {
    return await req.patch(`${routeWithId(apiRoutes.tickets, ticketId)}/assign`, payload)
  } catch (error) {
    if ([404, 405].includes(error.response?.status)) {
      return req.patch(routeWithId(apiRoutes.tickets, ticketId), payload)
    }

    throw error
  }
}

export function addTicketComment(ticketId, body) {
  return req.post(`${routeWithId(apiRoutes.tickets, ticketId)}/comments`, { body })
}

export function listTicketComments(ticketId) {
  return req.get(`${routeWithId(apiRoutes.tickets, ticketId)}/comments`)
}

export function listTicketAttachments(ticketId) {
  return req.get(`${routeWithId(apiRoutes.tickets, ticketId)}/attachments`)
}

export function uploadTicketAttachment(ticketId, file) {
  const formData = new FormData()

  formData.append('file', file)

  return req.post(`${routeWithId(apiRoutes.tickets, ticketId)}/attachments`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function listCategories(params = {}) {
  return req.withEndpointFallback(apiRoutes.categories, (endpoint) =>
    req.get(endpoint, { params }),
  )
}

export function createCategory(payload) {
  return req.withEndpointFallback(apiRoutes.categories, (endpoint) =>
    req.post(endpoint, payload),
  )
}

export function updateCategory(categoryId, payload) {
  return req.withEndpointFallback(apiRoutes.categories, (endpoint) =>
    req.patch(routeWithId(endpoint, categoryId), payload),
  )
}

export function deleteCategory(categoryId) {
  return req.withEndpointFallback(apiRoutes.categories, (endpoint) =>
    req.del(routeWithId(endpoint, categoryId)),
  )
}

export function listUsers(params = {}) {
  return req.get(apiRoutes.users, { params })
}

export async function createUser(payload) {
  const { role, ...registrationPayload } = payload
  const created = await req.post(apiRoutes.register, registrationPayload)
  const user = created.user ?? created

  if (user?.id && role && role !== user.role) {
    return updateUser(user.id, { role })
  }

  return created
}

export function updateUser(userId, payload) {
  return req.patch(`${routeWithId(apiRoutes.users, userId)}/role`, { role: payload.role })
}

export function listUserImports() {
  return req.get(apiRoutes.userImports)
}

export function importUsers({ file, updateExisting, defaultPassword }) {
  const formData = new FormData()

  formData.append('file', file)

  if (updateExisting) {
    formData.append('update_existing', '1')
  }

  if (defaultPassword) {
    formData.append('default_password', defaultPassword)
  }

  return req.post(apiRoutes.userImport, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function listSupportAgents() {
  return req.get(apiRoutes.supportAgents)
}

export function listNotifications() {
  return req.get(apiRoutes.notifications)
}

export function markNotificationRead(notificationId) {
  return req.patch(`${routeWithId(apiRoutes.notifications, notificationId)}/read`)
}

export function markAllNotificationsRead() {
  return req.patch(`${apiRoutes.notifications}/read-all`)
}

export function updateProfile(payload) {
  return req.patch(apiRoutes.profile, payload)
}

export function changePassword(payload) {
  return req.patch(apiRoutes.password, payload)
}
