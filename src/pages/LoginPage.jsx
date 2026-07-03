import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { Icon, inputClass, labelClass } from '../components/SupportUi'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    setError('')
    setLoading(true)

    try {
      await login(form)
      navigate('/dashboard')
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'No se pudo iniciar sesion.'

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen bg-[#f6f7f2] lg:grid-cols-[1fr_520px]">
      <section className="hidden bg-[#10231f] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-400 text-sm font-bold text-emerald-950">
            ST
          </div>
          <div>
            <p className="font-bold">Support Tickets</p>
            <p className="text-sm text-emerald-100/80">Mesa de soporte</p>
          </div>
        </div>

        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-lime-200">
            Gestion de tickets
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-normal">
            Soporte ordenado para clientes, agentes y administradores.
          </h1>
          <p className="mt-4 text-base leading-7 text-emerald-50/80">
            Tickets, comentarios, adjuntos, estados, asignaciones y usuarios en
            una sola consola operativa.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm text-emerald-50/80">
          <div className="rounded-lg border border-white/10 p-4">
            <p className="text-2xl font-bold text-white">24/7</p>
            <p className="mt-1">Seguimiento</p>
          </div>
          <div className="rounded-lg border border-white/10 p-4">
            <p className="text-2xl font-bold text-white">SLA</p>
            <p className="mt-1">Prioridades</p>
          </div>
          <div className="rounded-lg border border-white/10 p-4">
            <p className="text-2xl font-bold text-white">API</p>
            <p className="mt-1">Integrada</p>
          </div>
        </div>
      </section>

      <main className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 lg:hidden">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-700 text-sm font-bold text-white">
              ST
            </div>
          </div>

          <h2 className="text-2xl font-bold text-zinc-950">Iniciar sesion</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Acceso al panel de soporte.
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className={labelClass} htmlFor="email">
                Correo electronico
              </label>
              <input
                autoComplete="email"
                className={`${inputClass} mt-1`}
                id="email"
                name="email"
                onChange={handleChange}
                placeholder="admin@example.com"
                required
                type="email"
                value={form.email}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="password">
                Contrasena
              </label>
              <input
                autoComplete="current-password"
                className={`${inputClass} mt-1`}
                id="password"
                name="password"
                onChange={handleChange}
                placeholder="password"
                required
                type="password"
                value={form.password}
              />
            </div>

            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
              type="submit"
            >
              <Icon name="shield" />
              {loading ? 'Validando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default LoginPage
