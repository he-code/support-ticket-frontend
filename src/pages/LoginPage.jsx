import { useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import {
  buttonPrimaryClass,
  FieldError,
  Icon,
  inputClass,
  labelClass,
  LogoMark,
} from '../components/SupportUi'
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
    errors.email = 'Correo electrónico inválido'
  }
  if (!form.password) {
    errors.password = 'La contraseña es obligatoria'
  }
  return errors
}

const brandPoints = [
  'Colas y prioridades organizadas por estado',
  'SLA bajo control en cada conversación',
  'Historial completo de tickets y adjuntos',
]

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
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

  const from = location.state?.from?.pathname ?? '/dashboard'

  if (isAuthenticated) {
    return <Navigate replace to={from} />
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
      navigate(from, { replace: true })
    } catch {
      // error handled by useMutation
    }
  }

  const apiError = error && !fieldErrors.email && !fieldErrors.password ? error : null

  return (
    <div className="grid min-h-screen bg-bg lg:grid-cols-2">
      {/* Panel de marca */}
      <div className="relative hidden overflow-hidden lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-1/3 h-[560px] w-[560px] rounded-full opacity-30 blur-3xl bg-[radial-gradient(circle,_var(--color-accent)_0%,_var(--color-accent-2)_55%,_transparent_75%)]"
        />
        <div className="relative z-10 flex w-full flex-col justify-between p-12">
          <Link aria-label="Support Tickets — inicio" to="/">
            <LogoMark size={40} withWordmark />
          </Link>

          <div>
            <h2 className="max-w-md font-display text-3xl font-bold leading-tight tracking-tight text-text">
              El panel que tu equipo de soporte merece.
            </h2>
            <ul className="mt-8 space-y-4 text-sm text-muted">
              {brandPoints.map((point) => (
                <li className="flex items-center gap-3" key={point}>
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-gradient" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-muted">
            &copy; 2026 Support Tickets. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8 text-center">
            <div className="mb-4 lg:hidden">
              <Link className="inline-flex" to="/">
                <LogoMark size={44} />
              </Link>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-text">
              Iniciar sesión
            </h1>
            <p className="mt-1 text-sm text-muted">Accede al panel de soporte</p>
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
                  Correo electrónico
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
                  Contraseña
                </label>
                <div className="relative mt-1.5">
                  <Icon className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted" name="lock" />
                  <input
                    autoComplete="current-password"
                    className={`${inputClass} pl-10 pr-10`}
                    id="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="Contraseña"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                  />
                  <button
                    className="absolute right-2 top-2 rounded p-1 text-muted transition hover:text-text"
                    onClick={() => setShowPassword((s) => !s)}
                    tabIndex={-1}
                    title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    type="button"
                  >
                    <Icon className="h-4 w-4" name={showPassword ? 'eyeOff' : 'eye'} />
                  </button>
                </div>
                <FieldError message={fieldErrors.password} />
              </div>

              <div className="flex items-center gap-2">
                <input
                  checked={remember}
                  className="h-4 w-4 rounded border-border bg-surface text-accent focus:ring-accent"
                  id="remember"
                  onChange={(e) => setRemember(e.target.checked)}
                  type="checkbox"
                />
                <label className="text-sm text-muted" htmlFor="remember">
                  Recordar sesión
                </label>
              </div>

              <button
                className={`${buttonPrimaryClass} w-full px-4 py-2.5`}
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
    </div>
  )
}

export default LoginPage
