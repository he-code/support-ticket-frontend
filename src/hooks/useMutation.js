import { useState } from 'react'

export function useMutation() {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState('')

  const execute = async (fn, ...args) => {
    setSaving(true)
    setError(null)
    setNotice('')

    try {
      const result = await fn(...args)
      return result
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || 'Error inesperado'
      setError(msg)
      throw err
    } finally {
      setSaving(false)
    }
  }

  return { saving, error, notice, execute, setError, setNotice }
}
