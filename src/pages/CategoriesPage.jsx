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
    async () => collectionFromPayload(await listCategories({ per_page: 100 })),
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
  const loadCategories = () =>
    listCategories({ per_page: 100 }).then((d) => setCategories(collectionFromPayload(d)))

  const refreshCategories = async () => {
    try {
      await loadCategories()
    } catch {
      showToast('Cambio guardado, pero no se pudo refrescar la lista.', 'notice')
    }
  }

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
      await refreshCategories()
    } catch {
      // error handled by useMutation
    }
  }

  const toggleCategory = async (category) => {
    try {
      await execute(updateCategory, category.id, { is_active: !category.is_active })
      showToast('Categoria actualizada.')
      await refreshCategories()
    } catch {
      // error handled by useMutation
    }
  }

  const removeCategory = async (category) => {
    try {
      await execute(deleteCategory, category.id)
      setConfirmDelete(null)
      showToast('Categoria eliminada.')
      await refreshCategories()
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
        <div className="rounded-lg bg-danger/15 px-4 py-3 text-sm text-danger">
          {displayError}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Panel>
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold text-text">Listado</h2>
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
                      className="rounded-xl border border-border bg-surface p-4"
                      key={category.id}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-text">{category.name}</p>
                          <p className="mt-1 text-sm text-muted">
                            {category.description}
                          </p>
                        </div>
                        <Badge tone={active ? 'indigo' : 'slate'}>
                          {active ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </div>

                      <div className="mt-4 flex flex-wrap justify-end gap-2">
                        <button
                          className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted transition hover:bg-surface-hover"
                          onClick={() => toggleCategory(category)}
                          type="button"
                        >
                          {active ? 'Desactivar' : 'Activar'}
                        </button>
                        <button
                          aria-label="Eliminar categoria"
                          className="grid h-10 w-10 place-items-center rounded-lg border border-danger/30 text-danger transition hover:bg-danger/10"
                          onClick={() => setConfirmDelete(category)}
                          title="Eliminar categoria"
                          type="button"
                        >
                          <Icon name="trash" className="h-4 w-4" />
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full divide-y divide-border text-sm">
                  <thead>
                    <tr className="text-left text-xs font-semibold uppercase text-muted">
                      <th className="px-3 py-3">Nombre</th>
                      <th className="px-3 py-3">Estado</th>
                      <th className="px-3 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {categories.map((category) => {
                      const active = category.is_active !== false

                      return (
                        <tr className="align-top hover:bg-surface-hover/50" key={category.id}>
                          <td className="px-3 py-4">
                            <p className="font-semibold text-text">
                              {category.name}
                            </p>
                            <p className="mt-1 text-xs text-muted">
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
                                className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted transition hover:bg-surface-hover"
                                onClick={() => toggleCategory(category)}
                                type="button"
                              >
                                {active ? 'Desactivar' : 'Activar'}
                              </button>
                              <button
                                aria-label="Eliminar categoria"
                                className="grid h-10 w-10 place-items-center rounded-lg border border-danger/30 text-danger transition hover:bg-danger/10"
                                onClick={() => setConfirmDelete(category)}
                                title="Eliminar categoria"
                                type="button"
                              >
                                <Icon name="trash" className="h-4 w-4" />
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
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold text-text">Nueva categoria</h2>
          </div>
          <form className="space-y-5 p-5" onSubmit={handleSubmit}>
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
              <FieldError message={displayError} />
            </div>
            <div>
              <label className={labelClass} htmlFor="description">
                Descripcion
              </label>
              <textarea
                className={`${inputClass} mt-1.5 min-h-28 resize-y`}
                id="description"
                name="description"
                onChange={handleChange}
                value={form.description}
              />
            </div>
            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={saving}
              type="submit"
            >
              <Icon name="save" className="h-4 w-4" />
              {saving ? 'Guardando...' : 'Guardar categoria'}
            </button>
          </form>
        </Panel>
      </div>

      {confirmDelete && (
        <ConfirmModal
          confirmLabel="Eliminar"
          description="Esta accion no se puede deshacer."
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