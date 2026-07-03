import { useCallback, useEffect, useState } from 'react'
import {
  createUser,
  importUsers,
  listUserImports,
  listUsers,
  updateUser as saveUser,
} from '../api/support'
import {
  Badge,
  EmptyState,
  Icon,
  inputClass,
  labelClass,
  PageHeader,
  Panel,
  SkeletonRows,
} from '../components/SupportUi'
import { useAuth } from '../context/AuthContext'
import {
  collectionFromPayload,
  formatDate,
  getInitials,
  roleOptions,
} from '../lib/support'

function apiErrorMessage(error, fallback) {
  const errors = error.response?.data?.errors

  if (errors && typeof errors === 'object') {
    return Object.values(errors).flat().join(' ')
  }

  return error.response?.data?.message || fallback
}

function UsersPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [users, setUsers] = useState([])
  const [imports, setImports] = useState([])
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'user',
    password: '',
  })
  const [importForm, setImportForm] = useState({
    file: null,
    updateExisting: false,
    defaultPassword: '',
  })
  const [loading, setLoading] = useState(true)
  const [importsLoading, setImportsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importFileKey, setImportFileKey] = useState(0)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadUsers = useCallback(async () => {
    if (!isAdmin) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const data = await listUsers()
      setUsers(collectionFromPayload(data))
    } catch {
      setError('No se pudieron cargar los usuarios.')
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  const loadImports = useCallback(async () => {
    if (!isAdmin) {
      setImportsLoading(false)
      return
    }

    setImportsLoading(true)

    try {
      const data = await listUserImports()
      setImports(collectionFromPayload(data))
    } catch {
      setError('No se pudo cargar el historial de importaciones.')
    } finally {
      setImportsLoading(false)
    }
  }, [isAdmin])

  useEffect(() => {
    let cancelled = false

    Promise.resolve().then(() => {
      if (!cancelled) {
        loadUsers()
        loadImports()
      }
    })

    return () => {
      cancelled = true
    }
  }, [loadImports, loadUsers])

  if (!isAdmin) {
    return (
      <EmptyState
        description="Esta seccion esta reservada para administradores."
        title="Acceso restringido"
      />
    )
  }

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

    try {
      await createUser(form)
      setForm({ name: '', email: '', role: 'user', password: '' })
      setNotice('Usuario creado.')
      await loadUsers()
    } catch (error) {
      setError(apiErrorMessage(error, 'No se pudo crear el usuario.'))
    } finally {
      setSaving(false)
    }
  }

  const handleImportSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')

    if (!importForm.file) {
      setError('Selecciona un archivo CSV, TXT o XLSX.')
      return
    }

    setImporting(true)

    try {
      const response = await importUsers(importForm)
      const result = response.import ?? response

      setImportForm({
        file: null,
        updateExisting: false,
        defaultPassword: '',
      })
      setImportFileKey((current) => current + 1)
      setNotice(
        `Importacion completada: ${result.created_count ?? 0} creados, ${result.updated_count ?? 0} actualizados, ${result.skipped_count ?? 0} omitidos.`,
      )
      await Promise.all([loadUsers(), loadImports()])
    } catch (error) {
      setError(apiErrorMessage(error, 'No se pudo importar usuarios.'))
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const csv = [
      'name,email,role,password',
      'Maria Soporte,maria@example.com,support_agent,password123',
      'Cliente Demo,cliente@example.com,user,password123',
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'plantilla-importacion-usuarios.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const updateRole = async (targetUser, role) => {
    setError('')
    setNotice('')

    try {
      await saveUser(targetUser.id, { role })
      setUsers((current) =>
        current.map((item) =>
          item.id === targetUser.id ? { ...item, role } : item,
        ),
      )
      setNotice('Rol actualizado.')
    } catch {
      setError('No se pudo actualizar el rol.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Administracion de usuarios y roles."
        title="Usuarios admin"
      />

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

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Panel>
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-base font-semibold text-zinc-950">
              Usuarios
            </h2>
          </div>

          <div className="p-5">
            {loading ? (
              <SkeletonRows rows={6} />
            ) : users.length === 0 ? (
              <EmptyState
                description="Los usuarios registrados apareceran aqui."
                title="Sin usuarios"
              />
            ) : (
              <>
              <div className="space-y-3 md:hidden">
                {users.map((item) => {
                  return (
                    <article
                      className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
                      key={item.id}
                    >
                      <div className="flex items-start gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-700 text-xs font-bold text-white">
                          {getInitials(item.name ?? item.email)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-zinc-950">{item.name}</p>
                          <p className="truncate text-xs text-slate-500">
                            {item.email}
                          </p>
                          <div className="mt-3">
                            <Badge tone="sky">{item.role ?? 'user'}</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2">
                        <select
                          className={inputClass}
                          onChange={(event) => updateRole(item, event.target.value)}
                          value={item.role ?? 'user'}
                        >
                          {roleOptions.map((role) => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </article>
                  )
                })}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead>
                    <tr className="text-left text-xs font-semibold uppercase text-slate-500">
                      <th className="px-3 py-3">Usuario</th>
                      <th className="px-3 py-3">Rol</th>
                      <th className="px-3 py-3">Creado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((item) => {
                      return (
                        <tr className="align-middle hover:bg-slate-50" key={item.id}>
                          <td className="px-3 py-4">
                            <div className="flex items-center gap-3">
                              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-700 text-xs font-bold text-white">
                                {getInitials(item.name ?? item.email)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-zinc-950">
                                  {item.name}
                                </p>
                                <p className="truncate text-xs text-slate-500">
                                  {item.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-4">
                            <select
                              className={inputClass}
                              onChange={(event) =>
                                updateRole(item, event.target.value)
                              }
                              value={item.role ?? 'user'}
                            >
                              {roleOptions.map((role) => (
                                <option key={role.value} value={role.value}>
                                  {role.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-4 text-slate-500">
                            {item.created_at}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              </>
            )}
          </div>
        </Panel>

        <Panel>
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-base font-semibold text-zinc-950">
              Nuevo usuario
            </h2>
          </div>
          <form className="space-y-5 p-5" onSubmit={handleSubmit}>
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
              <label className={labelClass} htmlFor="role">
                Rol
              </label>
              <select
                className={`${inputClass} mt-1`}
                id="role"
                name="role"
                onChange={handleChange}
                value={form.role}
              >
                {roleOptions.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="password">
                Contrasena
              </label>
              <input
                className={`${inputClass} mt-1`}
                id="password"
                name="password"
                onChange={handleChange}
                required
                type="password"
                value={form.password}
              />
            </div>
            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={saving}
              type="submit"
            >
              <Icon name="save" />
              {saving ? 'Guardando...' : 'Crear usuario'}
            </button>
          </form>
        </Panel>
      </div>

      <Panel>
        <div className="grid gap-6 border-b border-slate-200 px-5 py-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-base font-semibold text-zinc-950">
              Importar usuarios
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Carga archivos CSV, TXT o XLSX con columnas name, email, role y
              password.
            </p>
          </div>
          <button
            className="flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            onClick={downloadTemplate}
            type="button"
          >
            <Icon name="upload" />
            Plantilla CSV
          </button>
        </div>

        <div className="grid gap-6 p-5 xl:grid-cols-[380px_1fr]">
          <form className="space-y-5" onSubmit={handleImportSubmit}>
            <div>
              <label className={labelClass} htmlFor="import_file">
                Archivo
              </label>
              <input
                accept=".csv,.txt,.xlsx"
                className={`${inputClass} mt-1`}
                id="import_file"
                key={importFileKey}
                onChange={(event) =>
                  setImportForm((current) => ({
                    ...current,
                    file: event.target.files?.[0] ?? null,
                  }))
                }
                required
                type="file"
              />
            </div>

            <label className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 text-sm text-zinc-700">
              <input
                checked={importForm.updateExisting}
                className="mt-1 h-4 w-4 rounded border-zinc-300 text-emerald-700"
                onChange={(event) =>
                  setImportForm((current) => ({
                    ...current,
                    updateExisting: event.target.checked,
                  }))
                }
                type="checkbox"
              />
              <span>
                Actualizar usuarios existentes si el correo ya esta registrado.
              </span>
            </label>

            <div>
              <label className={labelClass} htmlFor="default_password">
                Contrasena por defecto
              </label>
              <input
                className={`${inputClass} mt-1`}
                id="default_password"
                minLength={6}
                onChange={(event) =>
                  setImportForm((current) => ({
                    ...current,
                    defaultPassword: event.target.value,
                  }))
                }
                placeholder="Opcional"
                type="password"
                value={importForm.defaultPassword}
              />
            </div>

            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={importing}
              type="submit"
            >
              <Icon name="upload" />
              {importing ? 'Importando...' : 'Importar usuarios'}
            </button>
          </form>

          <div>
            <h3 className="text-sm font-semibold uppercase text-zinc-500">
              Historial
            </h3>

            <div className="mt-3">
              {importsLoading ? (
                <SkeletonRows rows={4} />
              ) : imports.length === 0 ? (
                <EmptyState
                  description="Las importaciones realizadas por administradores apareceran aqui."
                  title="Sin importaciones"
                />
              ) : (
                <div className="space-y-3">
                  {imports.map((item) => (
                    <article
                      className="rounded-lg border border-zinc-200 bg-white p-4"
                      key={item.id}
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-zinc-950">
                            {item.original_name}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {formatDate(item.created_at)}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge tone="emerald">
                            {item.created_count ?? 0} creados
                          </Badge>
                          <Badge tone="sky">
                            {item.updated_count ?? 0} actualizados
                          </Badge>
                          <Badge tone={(item.skipped_count ?? 0) > 0 ? 'amber' : 'slate'}>
                            {item.skipped_count ?? 0} omitidos
                          </Badge>
                        </div>
                      </div>

                      {Array.isArray(item.errors) && item.errors.length > 0 && (
                        <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                          <p className="font-semibold">Errores detectados</p>
                          <ul className="mt-2 space-y-1">
                            {item.errors.slice(0, 5).map((entry, index) => (
                              <li key={`${entry.row ?? index}-${entry.email ?? 'row'}`}>
                                Fila {entry.row}: {(entry.errors ?? []).join(', ')}
                              </li>
                            ))}
                          </ul>
                          {item.errors.length > 5 && (
                            <p className="mt-2 text-xs">
                              {item.errors.length - 5} errores adicionales.
                            </p>
                          )}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  )
}

export default UsersPage
