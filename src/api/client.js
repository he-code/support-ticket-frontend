import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_URL

if (!apiBaseUrl) {
  throw new Error(
    'Missing VITE_API_URL. Configure the Laravel API URL in Vercel and rebuild.',
  )
}

const api = axios.create({
  baseURL: apiBaseUrl.replace(/\/+$/, ''),
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

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
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

export default api
