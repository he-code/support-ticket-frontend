import { act, renderHook } from '@testing-library/react'
import { useMutation } from '../useMutation'

describe('useMutation', () => {
  it('starts with idle state', () => {
    const { result } = renderHook(() => useMutation())
    expect(result.current.saving).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.notice).toBe('')
  })

  it('sets saving during execution and clears on completion', async () => {
    const { result } = renderHook(() => useMutation())
    let resolve
    const fn = () => new Promise((r) => { resolve = r })

    act(() => { result.current.execute(fn) })
    expect(result.current.saving).toBe(true)

    await act(async () => { resolve() })
    expect(result.current.saving).toBe(false)
  })

  it('returns the resolved value', async () => {
    const { result } = renderHook(() => useMutation())
    const fn = () => Promise.resolve('ok')

    let value
    await act(async () => { value = await result.current.execute(fn) })
    expect(value).toBe('ok')
  })

  it('sets error on rejection and throws', async () => {
    const { result } = renderHook(() => useMutation())

    await act(async () => {
      try { await result.current.execute(() => Promise.reject(new Error('fail'))) }
      catch { /* expected */ }
    })

    expect(result.current.error).toBe('fail')
    expect(result.current.saving).toBe(false)
  })

  it('extracts message from error.response.data.message', async () => {
    const { result } = renderHook(() => useMutation())
    const err = { response: { data: { message: 'from API' } } }

    await act(async () => {
      try { await result.current.execute(() => Promise.reject(err)) }
      catch { /* expected */ }
    })

    expect(result.current.error).toBe('from API')
  })

  it('uses fallback error message when none available', async () => {
    const { result } = renderHook(() => useMutation())

    await act(async () => {
      try { await result.current.execute(() => Promise.reject({})) }
      catch { /* expected */ }
    })

    expect(result.current.error).toBe('Error inesperado')
  })

  it('setError updates error state', () => {
    const { result } = renderHook(() => useMutation())
    act(() => result.current.setError('custom error'))
    expect(result.current.error).toBe('custom error')
  })

  it('setNotice updates notice state', () => {
    const { result } = renderHook(() => useMutation())
    act(() => result.current.setNotice('custom notice'))
    expect(result.current.notice).toBe('custom notice')
  })

  it('clears previous error on new execution', async () => {
    const { result } = renderHook(() => useMutation())

    act(() => result.current.setError('old error'))
    expect(result.current.error).toBe('old error')

    let resolve
    const fn = () => new Promise((r) => { resolve = r })
    act(() => { result.current.execute(fn) })
    expect(result.current.error).toBeNull()

    await act(async () => { resolve() })
  })

  it('clears notice on new execution', async () => {
    const { result } = renderHook(() => useMutation())

    act(() => result.current.setNotice('old notice'))

    let resolve
    const fn = () => new Promise((r) => { resolve = r })
    act(() => { result.current.execute(fn) })
    expect(result.current.notice).toBe('')

    await act(async () => { resolve() })
  })
})
