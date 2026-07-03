import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { createTicket, listCategories } from '../api/support'
import {
  Icon,
  inputClass,
  labelClass,
  PageHeader,
  Panel,
} from '../components/SupportUi'
import {
  collectionFromPayload,
  getTicketId,
  priorityOptions,
} from '../lib/support'

function CreateTicketPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    category_id: '',
    priority: 'medium',
  })
  const [attachments, setAttachments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadCategories = async () => {
      try {
        const data = await listCategories()

        if (isMounted) {
          setCategories(collectionFromPayload(data))
        }
      } catch {
        if (isMounted) {
          setCategories([])
        }
      }
    }

    loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload = {
        title: form.title,
        description: form.description,
        category_id: form.category_id || null,
        priority: form.priority,
      }
      const created = await createTicket(payload, attachments)
      const ticket = created.ticket ?? created
      const ticketId = getTicketId(ticket)

      navigate(ticketId ? `/tickets/${ticketId}` : '/tickets')
    } catch (error) {
      setError(
        error.response?.data?.message || 'No se pudo crear el ticket.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Nuevo caso para seguimiento del equipo de soporte."
        title="Crear ticket"
      />

      {error && (
        <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <Panel>
        <form className="grid gap-6 p-5 lg:grid-cols-[1fr_320px]" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label className={labelClass} htmlFor="title">
                Asunto
              </label>
              <input
                className={`${inputClass} mt-1`}
                id="title"
                name="title"
                onChange={handleChange}
                placeholder="Ej. No puedo acceder al sistema"
                required
                value={form.title}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="description">
                Descripcion
              </label>
              <textarea
                className={`${inputClass} mt-1 min-h-44 resize-y`}
                id="description"
                name="description"
                onChange={handleChange}
                placeholder="Detalle del caso"
                required
                value={form.description}
              />
            </div>
          </div>

          <aside className="space-y-5">
            <div>
              <label className={labelClass} htmlFor="category_id">
                Categoria
              </label>
              <select
                className={`${inputClass} mt-1`}
                id="category_id"
                name="category_id"
                onChange={handleChange}
                value={form.category_id}
              >
                <option value="">Sin categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="priority">
                Prioridad
              </label>
              <select
                className={`${inputClass} mt-1`}
                id="priority"
                name="priority"
                onChange={handleChange}
                required
                value={form.priority}
              >
                {priorityOptions.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="attachments">
                Adjuntos
              </label>
              <input
                className={`${inputClass} mt-1`}
                id="attachments"
                multiple
                onChange={(event) =>
                  setAttachments(Array.from(event.target.files ?? []))
                }
                type="file"
              />
              {attachments.length > 0 && (
                <p className="mt-2 text-xs text-slate-500">
                  {attachments.length} archivo(s) seleccionado(s)
                </p>
              )}
            </div>

            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
              type="submit"
            >
              <Icon name="save" />
              {loading ? 'Creando...' : 'Crear ticket'}
            </button>
          </aside>
        </form>
      </Panel>
    </div>
  )
}

export default CreateTicketPage
