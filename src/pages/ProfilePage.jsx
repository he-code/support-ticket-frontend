import { useState } from 'react'
import { changePassword, updateProfile } from '../api/support'
import {
  Icon,
  inputClass,
  labelClass,
  PageHeader,
  Panel,
} from '../components/SupportUi'
import { useAuth } from '../context/AuthContext'
import { useMutation } from '../hooks/useMutation'
import { useToast } from '../context/ToastContext'
import { getRoleLabel } from '../lib/ticket'
import { getInitials } from '../lib/formatters'

function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState(() => ({
    name: user?.name ?? '',
    email: user?.email ?? '',
    current_password: '',
    password: '',
    password_confirmation: '',
  }))
  const { saving, error, execute, setError } = useMutation()
  const { showToast } = useToast()

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      name: form.name,
      email: form.email,
    }

    if (form.password && !form.current_password) {
      setError('Ingresa la contrasena actual para cambiarla.')
      return
    }

    if (form.password && form.password !== form.password_confirmation) {
      setError('Las contrasenas no coinciden.')
      return
    }

    try {
      const updated = await execute(updateProfile, payload)

      updateUser(updated.user ?? updated.profile ?? updated)

      if (form.password) {
        await execute(changePassword, {
          current_password: form.current_password,
          password: form.password,
          password_confirmation: form.password_confirmation,
        })
      }

      setForm((current) => ({
        ...current,
        current_password: '',
        password: '',
        password_confirmation: '',
      }))
      showToast('Perfil actualizado.')
    } catch {
      // error handled by useMutation
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader description="Datos de cuenta y acceso." title="Perfil" />

      {error && (
        <div className="rounded-lg bg-danger/15 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <Panel className="p-5">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-xl bg-accent text-lg font-bold text-white">
              {getInitials(user?.name ?? user?.email)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-text">{user?.name}</p>
              <p className="truncate text-sm text-muted">{user?.email}</p>
              <p className="mt-1 text-xs font-semibold uppercase text-muted">
                {getRoleLabel(user?.role)}
              </p>
            </div>
          </div>
        </Panel>

        <Panel>
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold text-text">Datos personales</h2>
          </div>

          <form className="grid gap-5 p-5 md:grid-cols-2" onSubmit={handleSubmit}>
            <div>
              <label className={labelClass} htmlFor="name">
                Nombre
              </label>
              <input
                className={`${inputClass} mt-1.5`}
                id="name"
                name="name"
                onChange={handleChange}
                required
                value={form.name}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="email">
                Correo
              </label>
              <input
                className={`${inputClass} mt-1.5`}
                id="email"
                name="email"
                onChange={handleChange}
                required
                type="email"
                value={form.email}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="current_password">
                Contrasena actual
              </label>
              <input
                className={`${inputClass} mt-1.5`}
                id="current_password"
                name="current_password"
                onChange={handleChange}
                type="password"
                value={form.current_password}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="password">
                Nueva contrasena
              </label>
              <input
                className={`${inputClass} mt-1.5`}
                id="password"
                name="password"
                onChange={handleChange}
                type="password"
                value={form.password}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="password_confirmation">
                Confirmar contrasena
              </label>
              <input
                className={`${inputClass} mt-1.5`}
                id="password_confirmation"
                name="password_confirmation"
                onChange={handleChange}
                type="password"
                value={form.password_confirmation}
              />
            </div>

            <div className="md:col-span-2">
              <button
                className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={saving}
                type="submit"
              >
                <Icon name="save" className="h-4 w-4" />
                {saving ? 'Guardando...' : 'Guardar perfil'}
              </button>
            </div>
          </form>
        </Panel>
      </div>
    </div>
  )
}

export default ProfilePage