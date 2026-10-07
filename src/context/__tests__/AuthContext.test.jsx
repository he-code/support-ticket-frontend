import { fireEvent, render, renderHook, screen } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext'

vi.mock('../../api/client', () => ({
  default: { post: vi.fn() },
}))

import api from '../../api/client'

function TestHarness() {
  const { updateUser } = useAuth()

  return (
    <div>
      <button
        onClick={() =>
          updateUser({ user: { id: 1, name: 'Ana', email: 'ana@test.com', role: 'admin' } })
        }
      >
        set-user
      </button>
      <button onClick={() => updateUser(undefined)}>clear-user</button>
    </div>
  )
}

function renderWithProvider(ui) {
  return render(<AuthProvider>{ui}</AuthProvider>)
}

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('updateUser persists the user in localStorage', () => {
    renderWithProvider(<TestHarness />)

    fireEvent.click(screen.getByText('set-user'))

    const stored = localStorage.getItem('user')
    expect(stored).not.toBeNull()
    expect(JSON.parse(stored)).toEqual({ id: 1, name: 'Ana', email: 'ana@test.com', role: 'admin' })
  })

  it('updateUser with a falsy value removes the stored user instead of saving "undefined"', () => {
    localStorage.setItem('user', JSON.stringify({ name: 'Admin' }))

    renderWithProvider(<TestHarness />)

    fireEvent.click(screen.getByText('clear-user'))

    expect(localStorage.getItem('user')).toBeNull()
  })

  it('login fails instead of fabricating a user when the API returns none', async () => {
    api.post.mockResolvedValue({ data: { token: 'tok-123' } })

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })

    await expect(
      result.current.login({ email: 'admin@example.com', password: 'secret' }),
    ).rejects.toThrow('La API no devolvio datos de usuario.')

    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })
})
