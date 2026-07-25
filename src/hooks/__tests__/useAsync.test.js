import { act, renderHook, waitFor } from '@testing-library/react'
import { useAsync } from '../useAsync'

describe('useAsync', () => {
  it('starts with loading true, data undefined, error null', () => {
    const { result } = renderHook(() => useAsync(async () => 'data', []))
    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBeNull()
  })

  it('returns data and sets loading false on success', async () => {
    const { result } = renderHook(() => useAsync(async () => 'data', []))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toBe('data')
    expect(result.current.error).toBeNull()
  })

  it('captures error on failure', async () => {
    const { result } = renderHook(() => useAsync(async () => { throw new Error('fail') }, []))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toBeUndefined()
    expect(result.current.error).toBe('fail')
  })

  it('extracts nested error message from API response', async () => {
    const apiError = { response: { data: { message: 'API error' } } }
    const { result } = renderHook(() => useAsync(async () => { throw apiError }, []))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('API error')
  })

  it('reload retriggers the async function', async () => {
    let callCount = 0
    const fn = async () => { callCount++; return `data-${callCount}` }
    const { result } = renderHook(() => useAsync(fn, []))
    await waitFor(() => expect(result.current.data).toBe('data-1'))
    act(() => result.current.reload())
    await waitFor(() => expect(result.current.data).toBe('data-2'))
  })

  it('reload sets loading back to true', async () => {
    const fn = async () => 'data'
    const { result } = renderHook(() => useAsync(fn, []))
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => result.current.reload())
    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
  })

  it('cancels in-flight request when deps change', async () => {
    let resolveFirst
    const firstPromise = new Promise((r) => { resolveFirst = r })
    const fn = vi.fn()
    fn.mockReturnValueOnce(firstPromise)
    fn.mockReturnValueOnce(Promise.resolve('second'))

    const { result, rerender } = renderHook(
      (props) => useAsync(props.fn, [props.dep]),
      { initialProps: { fn, dep: 1 } },
    )

    rerender({ fn, dep: 2 })
    resolveFirst()
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toBe('second')
  })

  it('setData updates data directly', async () => {
    const { result } = renderHook(() => useAsync(async () => 'initial', []))
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => result.current.setData('updated'))
    expect(result.current.data).toBe('updated')
  })

  it('runs again when deps change', async () => {
    const fn = vi.fn()
    fn.mockResolvedValue('result')

    const { rerender } = renderHook(
      (props) => useAsync(props.fn, [props.dep]),
      { initialProps: { fn, dep: 1 } },
    )

    await waitFor(() => expect(fn).toHaveBeenCalledTimes(1))
    rerender({ fn, dep: 2 })
    await waitFor(() => expect(fn).toHaveBeenCalledTimes(2))
  })
})
