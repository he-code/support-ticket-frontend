function normalizeEndpoint(endpoint) {
  if (!endpoint) return null

  const cleanEndpoint = endpoint.trim().replace(/\/+$/, '')

  if (!cleanEndpoint) return null

  return cleanEndpoint.startsWith('/') ? cleanEndpoint : `/${cleanEndpoint}`
}

function uniqueEndpoints(endpoints) {
  return [...new Set(endpoints.map(normalizeEndpoint).filter(Boolean))]
}

export const apiRoutes = {
  dashboardStats: '/dashboard/stats',
  register: '/register',
  tickets: '/tickets',
  categories: uniqueEndpoints([
    import.meta.env.VITE_CATEGORIES_ENDPOINT,
    import.meta.env.VITE_TICKET_CATEGORIES_ENDPOINT,
    '/categories',
    '/ticket-categories',
  ]),
  users: '/users',
  userImport: '/users/import',
  userImports: '/users/imports',
  supportAgents: '/support-agents',
  notifications: '/notifications',
  profile: '/profile',
  password: '/password',
}

export function routeWithId(endpoint, id) {
  return `${endpoint}/${id}`
}
