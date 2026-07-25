import api from './client'
import { payloadFromResponse } from '../lib/normalizers'

async function get(url, config) {
  return payloadFromResponse(await api.get(url, config))
}

async function post(url, data, config) {
  return payloadFromResponse(await api.post(url, data, config))
}

async function patch(url, data, config) {
  return payloadFromResponse(await api.patch(url, data, config))
}

async function del(url, config) {
  return payloadFromResponse(await api.delete(url, config))
}

const fallbackStatuses = [404, 405]

async function withEndpointFallback(endpoints, callback) {
  const routeOptions = Array.isArray(endpoints) ? endpoints : [endpoints]
  let lastError = null

  for (const endpoint of routeOptions) {
    try {
      return await callback(endpoint)
    } catch (error) {
      lastError = error

      if (!fallbackStatuses.includes(error.response?.status)) {
        throw error
      }
    }
  }

  throw lastError
}

export { get, post, patch, del, withEndpointFallback }
