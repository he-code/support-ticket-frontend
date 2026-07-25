import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { FieldError, inputClass, labelClass } from '../components/SupportUi'
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

function EyeIcon({ visible }) {
  if (visible) {
    return (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <path d="M1 1l22 22" />
      </svg>
    )
  }
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
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

function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const formRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

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
    <div className="grid min-h-screen bg-[var(--color-app)] lg:grid-cols-[1fr_480px]">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-[var(--color-sidebar)] px-12 py-12 text-white lg:flex">
        <div className="relative z-10 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-400 text-sm font-bold text-emerald-950 shadow-lg shadow-emerald-400/20">
            ST
          </div>
          <div>
            <p className="font-bold text-white">Support Tickets</p>
            <p className="text-sm text-emerald-100/70">Mesa de soporte</p>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <span className="inline-block rounded-full bg-lime-200/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-lime-200">
            Plataforma de gestion
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white">
            Soporte ordenado para clientes, agentes y administradores.
          </h1>
          <p className="mt-4 text-base leading-7 text-emerald-50/70">
            Tickets, comentarios, adjuntos, estados, asignaciones y usuarios en una sola consola operativa.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { value: '24/7', label: 'Seguimiento' },
            { value: 'SLA', label: 'Prioridades' },
            { value: 'API', label: 'Integrada' },
          ].map(({ value, label }) => (
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm" key={value}>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="mt-1 text-sm text-emerald-50/70">{label}</p>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-400/5 via-transparent to-lime-200/5" />
      </section>

      <main className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm animate-[fade-in_0.4s_ease-out]">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-700 text-sm font-bold text-white dark:bg-emerald-500 dark:text-emerald-950">
                ST
              </div>
              <div>
                <p className="font-bold text-zinc-950 dark:text-zinc-100">Support Tickets</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Mesa de soporte</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/50">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-100">Iniciar sesion</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Acceso al panel de soporte.
              </p>
            </div>

            {apiError && (
              <div className="mb-6 animate-[slide-down_0.25s_ease-out] rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-900/50 dark:text-rose-200">
                {apiError}
              </div>
            )}

            <form className="space-y-5" noValidate onSubmit={handleSubmit} ref={formRef}>
              <div>
                <label className={labelClass} htmlFor="email">
                  Correo electronico
                </label>
                <div className="relative mt-1">
                  <svg aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M4 5h16v14H4V5z" /><path d="M4 5l8 7 8-7" />
                  </svg>
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
                <div className="relative mt-1">
                  <svg aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <rect height="11" rx="2" ry="2" width="18" x="3" y="11" /><path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-zinc-400 transition hover:text-zinc-600 dark:hover:text-zinc-300"
                    onClick={() => setShowPassword((s) => !s)}
                    tabIndex={-1}
                    title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    type="button"
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>
                <FieldError message={fieldErrors.password} />
              </div>

              <div className="flex items-center gap-2">
                <input
                  checked={remember}
                  className="h-4 w-4 rounded border-zinc-300 text-emerald-700 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800"
                  id="remember"
                  onChange={(e) => setRemember(e.target.checked)}
                  type="checkbox"
                />
                <label className="text-sm text-zinc-600 dark:text-zinc-400" htmlFor="remember">
                  Recordar sesión
                </label>
              </div>

              <button
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
                type="submit"
              >
                {loading ? <Spinner /> : (
                  <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                )}
                {loading ? 'Validando...' : 'Entrar al panel'}
              </button>
            </form>
          </div>

          <div className="mt-4 text-center">
            <button
              className="text-xs text-zinc-400 transition hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
              onClick={() => setDark((d) => !d)}
              type="button"
            >
              {dark ? 'Modo claro' : 'Modo oscuro'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginPage
