import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react'
import { ToastProvider, useToast } from '../ToastContext'

function TestHarness() {
  const { showToast, toasts, removeToast } = useToast()

  return (
    <div>
      <button onClick={() => showToast('success message')}>show-success</button>
      <button onClick={() => showToast('error message', 'error')}>show-error</button>
      <button onClick={() => showToast('notice message', 'notice')}>show-notice</button>
      <button onClick={() => showToast('persistent', 'success', 0)}>show-persistent</button>
      <span data-testid="count">{toasts.length}</span>
      <ul>
        {toasts.map((t) => (
          <li key={t.id}>
            <span data-testid={`msg-${t.id}`}>{t.message}</span>
            <button data-testid={`close-${t.id}`} onClick={() => removeToast(t.id)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function renderWithProvider(ui) {
  return render(<ToastProvider>{ui}</ToastProvider>)
}

describe('ToastProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('provides context via useToast', () => {
    const { result } = renderHook(() => useToast(), { wrapper: ToastProvider })
    expect(result.current.showToast).toBeDefined()
    expect(result.current.removeToast).toBeDefined()
    expect(result.current.toasts).toEqual([])
  })

  it('shows a success toast', () => {
    renderWithProvider(<TestHarness />)
    fireEvent.click(screen.getByText('show-success'))
    expect(screen.getAllByText('success message')).toHaveLength(2)
    expect(screen.getByTestId('count').textContent).toBe('1')
  })

  it('shows error and notice toasts', () => {
    renderWithProvider(<TestHarness />)
    fireEvent.click(screen.getByText('show-error'))
    fireEvent.click(screen.getByText('show-notice'))
    expect(screen.getAllByText('error message')).toHaveLength(2)
    expect(screen.getAllByText('notice message')).toHaveLength(2)
    expect(screen.getByTestId('count').textContent).toBe('2')
  })

  it('removes a toast via close button', () => {
    renderWithProvider(<TestHarness />)
    fireEvent.click(screen.getByText('show-success'))
    const closeBtn = screen.getByTestId(/close-/)
    fireEvent.click(closeBtn)
    expect(screen.queryByTestId(/msg-/)).not.toBeInTheDocument()
    expect(screen.getByTestId('count').textContent).toBe('0')
  })

  it('auto-dismisses after default duration (4000ms)', () => {
    renderWithProvider(<TestHarness />)
    fireEvent.click(screen.getByText('show-success'))
    expect(screen.getAllByText('success message')).toHaveLength(2)
    act(() => { vi.advanceTimersByTime(4000) })
    expect(screen.queryByTestId(/msg-/)).not.toBeInTheDocument()
  })

  it('does not auto-dismiss when duration is 0', () => {
    renderWithProvider(<TestHarness />)
    fireEvent.click(screen.getByText('show-persistent'))
    expect(screen.getAllByText('persistent')).toHaveLength(2)
    act(() => { vi.advanceTimersByTime(10000) })
    expect(screen.getAllByText('persistent')).toHaveLength(2)
  })

  it('returns a unique id from showToast', () => {
    const { result } = renderHook(() => useToast(), { wrapper: ToastProvider })
    let id1, id2
    act(() => { id1 = result.current.showToast('first') })
    act(() => { id2 = result.current.showToast('second') })
    expect(id1).not.toBe(id2)
  })
})
