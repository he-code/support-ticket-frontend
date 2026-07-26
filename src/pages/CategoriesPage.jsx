import { useState } from 'react'
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from '../api/support'
import {
  Badge,
  EmptyState,
  FieldError,
  Icon,
  inputClass,
  labelClass,
  PageHeader,
  Panel,
  SkeletonRows,
} from '../components/SupportUi'
import ConfirmModal from '../components/ConfirmModal'
import { useAsync } from '../hooks/useAsync'
import { useMutation } from '../hooks/useMutation'
import { useToast } from '../context/ToastContext'
import { collectionFromPayload } from '../lib/normalizers'

function CategoriesPage() {
  const { data: categories = [], loading, error, setData: setCategories } = useAsync(
    async () => collectionFromPayload(await listCategories()),
    [],
  )
  const [form, setForm] = useState({
    name: '',
    description: '',
  })
  const [confirmDelete, setConfirmDelete] = useState(null)
  const { saving, error: mutationError, execute } = useMutation()
  const { showToast } = useToast()

  const displayError = mutationError || error
  const loadCategories = () => listCategories().then(d => setCategories(collectionFromPayload(d)))

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await execute(createCategory, form)
      setForm({ name: '', description: '' })
      showToast('Categoria creada.')
      await loadCategories()
    } catch {
      // error handled by useMutation
    }
  }

  const toggleCategory = async (category) => {
    try {
      await execute(updateCategory, category.id, { is_active: !category.is_active })
      showToast('Categoria actualizada.')
      await loadCategories()
    } catch {
      // error handled by useMutation
    }
  }

  const removeCategory = async (category) => {
    try {
      await execute(deleteCategory, category.id)
      setConfirmDelete(null)
      showToast('Categoria eliminada.')
      await loadCategories()
    } catch {
      // error handled by useMutation
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Clasificacion de tickets para filtros y reportes."
        title="Categorias"
      />

      {displayError && (
        <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-900/50 dark:text-rose-200">
          {displayError}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Panel>
          <div className="border-b border-slate-200 px-5 py-4 dark:border-zinc-700">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-100">
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
                      className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800"
                      key={category.id}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-zinc-950 dark:text-zinc-100">
                            {category.name}
                          </p>
                          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                            {category.description}
                          </p>
                        </div>
                        <Badge tone={active ? 'indigo' : 'slate'}>
                          {active ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </div>

                      <div className="mt-4 flex flex-wrap justify-end gap-2">
                        <button
                          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                          onClick={() => toggleCategory(category)}
                          type="button"
                        >
                          {active ? 'Desactivar' : 'Activar'}
                        </button>
                        <button
                          aria-label="Eliminar categoria"
                          className="grid h-10 w-10 place-items-center rounded-lg border border-rose-200 text-rose-700 transition hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/30"
                          onClick={() => setConfirmDelete(category)}
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
                <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-zinc-700">
                  <thead>
                    <tr className="text-left text-xs font-semibold uppercase text-slate-500 dark:text-zinc-400">
                      <th className="px-3 py-3">Nombre</th>
                      <th className="px-3 py-3">Estado</th>
                      <th className="px-3 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-700/50">
                    {categories.map((category) => {
                      const active = category.is_active !== false

                      return (
                        <tr className="align-top hover:bg-slate-50 dark:hover:bg-zinc-800/50" key={category.id}>
                          <td className="px-3 py-4">
                            <p className="font-semibold text-zinc-950 dark:text-zinc-100">
                              {category.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                              {category.description}
                            </p>
                          </td>
                          <td className="px-3 py-4">
                            <Badge tone={active ? 'indigo' : 'slate'}>
                              {active ? 'Activa' : 'Inactiva'}
                            </Badge>
                          </td>
                          <td className="px-3 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                onClick={() => toggleCategory(category)}
                                type="button"
                              >
                                {active ? 'Desactivar' : 'Activar'}
                              </button>
                              <button
                                aria-label="Eliminar categoria"
                                className="grid h-10 w-10 place-items-center rounded-lg border border-rose-200 text-rose-700 transition hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/30"
                                onClick={() => setConfirmDelete(category)}
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
          <div className="border-b border-slate-200 px-5 py-4 dark:border-zinc-700">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-100">
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
              <FieldError message={displayError} />
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
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={saving}
              type="submit"
            >
              <Icon name="save" />
              {saving ? 'Guardando...' : 'Guardar categoria'}
            </button>
          </form>
        </Panel>
      </div>

      {confirmDelete && (
        <ConfirmModal
          confirmLabel="Eliminar"
          description={`Esta accion no se puede deshacer.`}
          loading={saving}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => removeCategory(confirmDelete)}
          title={`Eliminar ${confirmDelete.name}?`}
          tone="rose"
        />
      )}
    </div>
  )
}

export default CategoriesPage



