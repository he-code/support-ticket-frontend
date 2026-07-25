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
