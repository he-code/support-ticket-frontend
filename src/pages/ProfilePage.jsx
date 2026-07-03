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
import { getInitials, getRoleLabel } from '../lib/support'

function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState(() => ({
    name: user?.name ?? '',
    email: user?.email ?? '',
    current_password: '',
    password: '',
    password_confirmation: '',
  }))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')

    const payload = {
      name: form.name,
      email: form.email,
    }

    if (form.password) {
      if (!form.current_password) {
        setError('Ingresa la contrasena actual para cambiarla.')
        setSaving(false)
        return
      }
    }

    try {
      const updated = await updateProfile(payload)

      if (form.password) {
        await changePassword({
          current_password: form.current_password,
          password: form.password,
          password_confirmation: form.password_confirmation,
        })
      }

      updateUser(updated.user ?? updated.profile ?? updated)
      setForm((current) => ({
        ...current,
        current_password: '',
        password: '',
        password_confirmation: '',
      }))
      setNotice('Perfil actualizado.')
    } catch (error) {
      setError(error.response?.data?.message || 'No se pudo actualizar el perfil.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader description="Datos de cuenta y acceso." title="Perfil" />

      {notice && (
        <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {notice}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <Panel className="p-5">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-lg bg-emerald-700 text-lg font-bold text-white">
              {getInitials(user?.name ?? user?.email)}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-zinc-950">
                {user?.name}
              </p>
              <p className="truncate text-sm text-slate-500">{user?.email}</p>
              <p className="mt-1 text-xs font-semibold uppercase text-slate-400">
                {getRoleLabel(user?.role)}
              </p>
            </div>
          </div>
        </Panel>

        <Panel>
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-base font-semibold text-zinc-950">
              Datos personales
            </h2>
          </div>

          <form className="grid gap-5 p-5 md:grid-cols-2" onSubmit={handleSubmit}>
            <div>
              <label className={labelClass} htmlFor="name">
                Nombre
              </label>
              <input
                className={`${inputClass} mt-1`}
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
                className={`${inputClass} mt-1`}
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
                className={`${inputClass} mt-1`}
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
                className={`${inputClass} mt-1`}
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
                className={`${inputClass} mt-1`}
                id="password_confirmation"
                name="password_confirmation"
                onChange={handleChange}
                type="password"
                value={form.password_confirmation}
              />
            </div>

            <div className="md:col-span-2">
              <button
                className="flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={saving}
                type="submit"
              >
                <Icon name="save" />
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
