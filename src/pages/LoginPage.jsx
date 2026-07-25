import { useEffect, useState } from 'react'
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

function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const { saving: loading, error, execute } = useMutation()

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />
  }

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await execute(login, form)
      navigate('/dashboard')
    } catch {
      // error handled by useMutation
    }
  }

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
        <div className="w-full max-w-sm">
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

            {error && (
              <div className="mb-6 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-900/50 dark:text-rose-200">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
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
                <FieldError message={error} />
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
                    className={`${inputClass} pl-10`}
                    id="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="Contrasena"
                    required
                    type="password"
                    value={form.password}
                  />
                </div>
                <FieldError message={error} />
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
