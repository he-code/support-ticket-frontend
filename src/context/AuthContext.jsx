/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import api from '../api/client'

const AuthContext = createContext(null)

function readAuthPayload(response, credentials) {
  const body = response?.data ?? {}
  const data = body.data ?? body
  const token =
    data.token ??
    data.access_token ??
    data.accessToken ??
    body.token ??
    body.access_token
  const user =
    data.user ??
    body.user ??
    data.profile ??
    (credentials?.email
      ? {
          name: credentials.email,
          email: credentials.email,
          role: 'user',
        }
      : null)

  if (!token) {
    throw new Error('La API no devolvio un token de acceso.')
  }

  return { token, user }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) return null

    try {
      return JSON.parse(storedUser)
    } catch {
      localStorage.removeItem('user')
      return null
    }
  })

  const updateUser = (nextUser) => {
    const resolvedUser = nextUser?.user ?? nextUser

    localStorage.setItem('user', JSON.stringify(resolvedUser))
    setUser(resolvedUser)
  }

  const login = async (credentials) => {
    const response = await api.post('/login', credentials)
    const auth = readAuthPayload(response, credentials)

    localStorage.setItem('token', auth.token)
    localStorage.setItem('user', JSON.stringify(auth.user))

    setToken(auth.token)
    setUser(auth.user)

    return auth
  }

  const logout = async () => {
    try {
      await api.post('/logout')
    } catch {
      // La sesion local siempre se limpia aunque la API ya no acepte el token.
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      setToken(null)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
