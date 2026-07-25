import { useCallback, useEffect, useRef, useState } from 'react'

export function useAsync(fn, deps = []) {
  const [data, setData] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadCount, setReloadCount] = useState(0)
  const fnRef = useRef(fn)
  fnRef.current = fn

  const reload = useCallback(() => {
    setReloadCount((c) => c + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    fnRef.current()
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message || err?.message || err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [...deps, reloadCount])

  return { data, loading, error, setData, reload }
}
