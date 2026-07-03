import api from './client'
import { apiRoutes, routeWithId } from '../config/apiRoutes'
import { getTicketId, payloadFromResponse } from '../lib/support'

const fallbackStatuses = [404, 405]

async function requestWithEndpointFallback(endpoints, callback) {
  const routeOptions = Array.isArray(endpoints) ? endpoints : [endpoints]
  let lastError = null

  for (const endpoint of routeOptions) {
    try {
      return payloadFromResponse(await callback(endpoint))
    } catch (error) {
      lastError = error

      if (!fallbackStatuses.includes(error.response?.status)) {
        throw error
      }
    }
  }

  throw lastError
}

export async function getDashboardStats() {
  return payloadFromResponse(await api.get(apiRoutes.dashboardStats))
}

export async function listTickets(params = {}) {
  return payloadFromResponse(await api.get(apiRoutes.tickets, { params }))
}

export async function getTicket(ticketId) {
  return payloadFromResponse(await api.get(routeWithId(apiRoutes.tickets, ticketId)))
}

export async function createTicket(payload, attachments = []) {
  const created = payloadFromResponse(await api.post(apiRoutes.tickets, payload))
  const ticket = created.ticket ?? created
  const ticketId = getTicketId(ticket)

  if (ticketId && attachments.length > 0) {
    await Promise.all(
      attachments.map((file) => uploadTicketAttachment(ticketId, file)),
    )
  }

  return created
}

export async function updateTicketStatus(ticketId, status) {
  try {
    return payloadFromResponse(
      await api.patch(`${routeWithId(apiRoutes.tickets, ticketId)}/status`, {
        status,
      }),
    )
  } catch (error) {
    if ([404, 405].includes(error.response?.status)) {
      return payloadFromResponse(
        await api.patch(routeWithId(apiRoutes.tickets, ticketId), { status }),
      )
    }

    throw error
  }
}

export async function assignTicket(ticketId, agentId) {
  const payload = {
    assigned_to_id: agentId || null,
  }

  try {
    return payloadFromResponse(
      await api.patch(`${routeWithId(apiRoutes.tickets, ticketId)}/assign`, payload),
    )
  } catch (error) {
    if ([404, 405].includes(error.response?.status)) {
      return payloadFromResponse(
        await api.patch(routeWithId(apiRoutes.tickets, ticketId), payload),
      )
    }

    throw error
  }
}

export async function addTicketComment(ticketId, body) {
  return payloadFromResponse(
    await api.post(`${routeWithId(apiRoutes.tickets, ticketId)}/comments`, { body }),
  )
}

export async function listTicketComments(ticketId) {
  return payloadFromResponse(
    await api.get(`${routeWithId(apiRoutes.tickets, ticketId)}/comments`),
  )
}

export async function listTicketAttachments(ticketId) {
  return payloadFromResponse(
    await api.get(`${routeWithId(apiRoutes.tickets, ticketId)}/attachments`),
  )
}

export async function uploadTicketAttachment(ticketId, file) {
  const formData = new FormData()

  formData.append('file', file)

  return payloadFromResponse(
    await api.post(`${routeWithId(apiRoutes.tickets, ticketId)}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  )
}

export async function listCategories(params = {}) {
  return requestWithEndpointFallback(apiRoutes.categories, (endpoint) =>
    api.get(endpoint, { params }),
  )
}

export async function createCategory(payload) {
  return requestWithEndpointFallback(apiRoutes.categories, (endpoint) =>
    api.post(endpoint, payload),
  )
}

export async function updateCategory(categoryId, payload) {
  return requestWithEndpointFallback(apiRoutes.categories, (endpoint) =>
    api.patch(routeWithId(endpoint, categoryId), payload),
  )
}

export async function deleteCategory(categoryId) {
  return requestWithEndpointFallback(apiRoutes.categories, (endpoint) =>
    api.delete(routeWithId(endpoint, categoryId)),
  )
}

export async function listUsers(params = {}) {
  return payloadFromResponse(await api.get(apiRoutes.users, { params }))
}

export async function createUser(payload) {
  const { role, ...registrationPayload } = payload
  const created = payloadFromResponse(
    await api.post(apiRoutes.register, registrationPayload),
  )
  const user = created.user ?? created

  if (user?.id && role && role !== user.role) {
    return updateUser(user.id, { role })
  }

  return created
}

export async function updateUser(userId, payload) {
  return payloadFromResponse(
    await api.patch(`${routeWithId(apiRoutes.users, userId)}/role`, {
      role: payload.role,
    }),
  )
}

export async function listUserImports() {
  return payloadFromResponse(await api.get(apiRoutes.userImports))
}

export async function importUsers({ file, updateExisting, defaultPassword }) {
  const formData = new FormData()

  formData.append('file', file)

  if (updateExisting) {
    formData.append('update_existing', '1')
  }

  if (defaultPassword) {
    formData.append('default_password', defaultPassword)
  }

  return payloadFromResponse(
    await api.post(apiRoutes.userImport, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  )
}

export async function listSupportAgents() {
  return payloadFromResponse(await api.get(apiRoutes.supportAgents))
}

export async function listNotifications() {
  return payloadFromResponse(await api.get(apiRoutes.notifications))
}

export async function markNotificationRead(notificationId) {
  return payloadFromResponse(
    await api.patch(`${routeWithId(apiRoutes.notifications, notificationId)}/read`),
  )
}

export async function markAllNotificationsRead() {
  return payloadFromResponse(await api.patch(`${apiRoutes.notifications}/read-all`))
}

export async function updateProfile(payload) {
  return payloadFromResponse(await api.patch(apiRoutes.profile, payload))
}

export async function changePassword(payload) {
  return payloadFromResponse(await api.patch(apiRoutes.password, payload))
}
