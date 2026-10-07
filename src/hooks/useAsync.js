import { useCallback, useEffect, useRef, useState } from 'react'

export function useAsync(fn, deps = []) {
  const [data, setData] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadCount, setReloadCount] = useState(0)
  const fnRef = useRef(fn)

  useEffect(() => {
    fnRef.current = fn
  })

  const reload = useCallback(() => {
    setLoading(true)
    setReloadCount((c) => c + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    // Inicio de fetch: la bandera de carga no es derivable del render
    // (patron estandar de data fetching), por eso el disable puntual.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
  }, [...deps, reloadCount]) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, setData, reload }
}
