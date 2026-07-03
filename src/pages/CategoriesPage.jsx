import { useCallback, useEffect, useState } from 'react'
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
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
import { collectionFromPayload } from '../lib/support'

function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    name: '',
    description: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadCategories = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await listCategories()
      setCategories(collectionFromPayload(data))
    } catch {
      setError('No se pudieron cargar las categorias.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    Promise.resolve().then(() => {
      if (!cancelled) loadCategories()
    })

    return () => {
      cancelled = true
    }
  }, [loadCategories])

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
      await createCategory(form)
      setForm({ name: '', description: '' })
      setNotice('Categoria creada.')
      await loadCategories()
    } catch (error) {
      setError(error.response?.data?.message || 'No se pudo crear la categoria.')
    } finally {
      setSaving(false)
    }
  }

  const toggleCategory = async (category) => {
    setError('')
    setNotice('')

    try {
      await updateCategory(category.id, { is_active: !category.is_active })
      setNotice('Categoria actualizada.')
      await loadCategories()
    } catch {
      setError('No se pudo actualizar la categoria.')
    }
  }

  const removeCategory = async (category) => {
    const confirmed = window.confirm(`Eliminar ${category.name}?`)
    if (!confirmed) return

    setError('')
    setNotice('')

    try {
      await deleteCategory(category.id)
      setNotice('Categoria eliminada.')
      await loadCategories()
    } catch {
      setError('No se pudo eliminar la categoria.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Clasificacion de tickets para filtros y reportes."
        title="Categorias"
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

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Panel>
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-base font-semibold text-zinc-950">
              Listado
            </h2>
          </div>
          <div className="p-5">
            {loading ? (
              <SkeletonRows rows={5} />
            ) : categories.length === 0 ? (
              <EmptyState
                description="Las categorias creadas desde la API apareceran aqui."
                title="Sin categorias"
              />
            ) : (
              <>
              <div className="space-y-3 md:hidden">
                {categories.map((category) => {
                  const active = category.is_active !== false

                  return (
                    <article
                      className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
                      key={category.id}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-zinc-950">
                            {category.name}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {category.description}
                          </p>
                        </div>
                        <Badge tone={active ? 'emerald' : 'slate'}>
                          {active ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </div>

                      <div className="mt-4 flex flex-wrap justify-end gap-2">
                        <button
                          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                          onClick={() => toggleCategory(category)}
                          type="button"
                        >
                          {active ? 'Desactivar' : 'Activar'}
                        </button>
                        <button
                          aria-label="Eliminar categoria"
                          className="grid h-10 w-10 place-items-center rounded-lg border border-rose-200 text-rose-700 transition hover:bg-rose-50"
                          onClick={() => removeCategory(category)}
                          title="Eliminar categoria"
                          type="button"
                        >
                          <Icon name="trash" />
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead>
                    <tr className="text-left text-xs font-semibold uppercase text-slate-500">
                      <th className="px-3 py-3">Nombre</th>
                      <th className="px-3 py-3">Estado</th>
                      <th className="px-3 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {categories.map((category) => {
                      const active = category.is_active !== false

                      return (
                        <tr className="align-top hover:bg-slate-50" key={category.id}>
                          <td className="px-3 py-4">
                            <p className="font-semibold text-zinc-950">
                              {category.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {category.description}
                            </p>
                          </td>
                          <td className="px-3 py-4">
                            <Badge tone={active ? 'emerald' : 'slate'}>
                              {active ? 'Activa' : 'Inactiva'}
                            </Badge>
                          </td>
                          <td className="px-3 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                onClick={() => toggleCategory(category)}
                                type="button"
                              >
                                {active ? 'Desactivar' : 'Activar'}
                              </button>
                              <button
                                aria-label="Eliminar categoria"
                                className="grid h-10 w-10 place-items-center rounded-lg border border-rose-200 text-rose-700 transition hover:bg-rose-50"
                                onClick={() => removeCategory(category)}
                                title="Eliminar categoria"
                                type="button"
                              >
                                <Icon name="trash" />
                              </button>
                            </div>
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
              Nueva categoria
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
              <label className={labelClass} htmlFor="description">
                Descripcion
              </label>
              <textarea
                className={`${inputClass} mt-1 min-h-28 resize-y`}
                id="description"
                name="description"
                onChange={handleChange}
                value={form.description}
              />
            </div>
            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={saving}
              type="submit"
            >
              <Icon name="save" />
              {saving ? 'Guardando...' : 'Guardar categoria'}
            </button>
          </form>
        </Panel>
      </div>
    </div>
  )
}

export default CategoriesPage
