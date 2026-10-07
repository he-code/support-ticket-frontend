import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_URL

if (!apiBaseUrl) {
  console.warn(
    'VITE_API_URL no esta definida: las peticiones a la API fallaran. Configura .env (ver .env.example).',
  )
}

const api = axios.create({
  baseURL: (apiBaseUrl ?? '').replace(/\/+$/, ''),
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

let redirecting = false

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const isLoginRequest = error.config?.url?.includes('/login')

    if (status === 401 && !isLoginRequest) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      // Guard: N respuestas 401 concurrentes disparan una sola expulsion.
      if (!redirecting && window.location.pathname !== '/login') {
        redirecting = true
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

export default api
