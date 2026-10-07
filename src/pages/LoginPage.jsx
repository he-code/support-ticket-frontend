import { useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { FieldError, Icon, inputClass, labelClass } from '../components/SupportUi'
import { useAuth } from '../context/AuthContext'
import { useMutation } from '../hooks/useMutation'

function Spinner() {
  return (
    <svg aria-hidden="true" className="-ml-1 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" />
    </svg>
  )
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(form) {
  const errors = {}
  if (!form.email.trim()) {
    errors.email = 'El correo es obligatorio'
  } else if (!emailRegex.test(form.email.trim())) {
    errors.email = 'Correo electronico invalido'
  }
  if (!form.password) {
    errors.password = 'La contrasena es obligatoria'
  }
  return errors
}

function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const formRef = useRef(null)

  const [form, setForm] = useState(() => ({
    email: localStorage.getItem('remembered_email') || '',
    password: '',
  }))

  const [remember, setRemember] = useState(() => Boolean(localStorage.getItem('remembered_email')))

  const { saving: loading, error, execute } = useMutation()

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />
  }

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
    if (fieldErrors[event.target.name]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[event.target.name]
        return next
      })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const errors = validate(form)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    if (remember) {
      localStorage.setItem('remembered_email', form.email.trim())
    } else {
      localStorage.removeItem('remembered_email')
    }

    try {
      await execute(login, form)
      navigate('/dashboard')
    } catch {
      // error handled by useMutation
    }
  }

  const apiError = error && !fieldErrors.email && !fieldErrors.password ? error : null

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-accent text-sm font-bold text-white shadow-lg shadow-accent/20">
            ST
          </div>
          <h1 className="mt-4 text-2xl font-bold text-text">Iniciar sesion</h1>
          <p className="mt-1 text-sm text-muted">Acceso al panel de soporte</p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          {apiError && (
            <div className="mb-6 animate-slide-down rounded-lg bg-danger/15 px-4 py-3 text-sm text-danger">
              {apiError}
            </div>
          )}

          <form className="space-y-5" noValidate onSubmit={handleSubmit} ref={formRef}>
            <div>
              <label className={labelClass} htmlFor="email">
                Correo electronico
              </label>
              <div className="relative mt-1.5">
                <Icon className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted" name="mail" />
                <input
                  autoComplete="email"
                  className={`${inputClass} pl-10`}
                  id="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  required
                  type="email"
                  value={form.email}
                />
              </div>
              <FieldError message={fieldErrors.email} />
            </div>

            <div>
              <label className={labelClass} htmlFor="password">
                Contrasena
              </label>
              <div className="relative mt-1.5">
                <Icon className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted" name="lock" />
                <input
                  autoComplete="current-password"
                  className={`${inputClass} pl-10 pr-10`}
                  id="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="Contrasena"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                />
                <button
                  className="absolute right-2 top-2 rounded p-1 text-muted transition hover:text-text"
                  onClick={() => setShowPassword((s) => !s)}
                  tabIndex={-1}
                  title={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                  type="button"
                >
                  <Icon className="h-4 w-4" name={showPassword ? 'eyeOff' : 'eye'} />
                </button>
              </div>
              <FieldError message={fieldErrors.password} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  checked={remember}
                  className="h-4 w-4 rounded border-border bg-surface text-accent focus:ring-accent"
                  id="remember"
                  onChange={(e) => setRemember(e.target.checked)}
                  type="checkbox"
                />
                <label className="text-sm text-muted" htmlFor="remember">
                  Recordar sesion
                </label>
              </div>
              <button
                className="text-xs text-muted transition hover:text-text"
                type="button"
              >
                Olvidaste tu contrasena?
              </button>
            </div>

            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
              type="submit"
            >
              {loading ? <Spinner /> : (
                <Icon className="h-4 w-4" name="shield" />
              )}
              {loading ? 'Validando...' : 'Entrar al panel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage