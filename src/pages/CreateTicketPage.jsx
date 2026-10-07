import { useState } from 'react'
import { useNavigate } from 'react-router'
import { createTicket, listCategories } from '../api/support'
import {
  Icon,
  inputClass,
  labelClass,
  PageHeader,
  Panel,
} from '../components/SupportUi'
import { useAsync } from '../hooks/useAsync'
import { useMutation } from '../hooks/useMutation'
import { useToast } from '../context/ToastContext'
import { collectionFromPayload } from '../lib/normalizers'
import { getTicketId } from '../lib/ticket'
import { priorityOptions } from '../lib/constants'

function CreateTicketPage() {
  const navigate = useNavigate()
  const { data: categories = [] } = useAsync(
    async () => collectionFromPayload(await listCategories({ per_page: 100 })),
    [],
  )
  const [form, setForm] = useState({
    title: '',
    description: '',
    category_id: '',
    priority: 'medium',
  })
  const [attachments, setAttachments] = useState([])
  const { saving: loading, error, execute } = useMutation()
  const { showToast } = useToast()

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const payload = {
        title: form.title,
        description: form.description,
        category_id: form.category_id || null,
        priority: form.priority,
      }
      const result = await execute(createTicket, payload, attachments)
      const ticketId = getTicketId(result.ticket ?? result.created)

      showToast(
        result.failedAttachments > 0
          ? `Ticket creado, pero ${result.failedAttachments} adjunto(s) no se subieron.`
          : 'Ticket creado.',
        result.failedAttachments > 0 ? 'notice' : 'success',
      )

      navigate(ticketId ? `/tickets/${ticketId}` : '/tickets')
    } catch {
      // error handled by useMutation
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Nuevo caso para seguimiento del equipo de soporte."
        title="Crear ticket"
      />

      {error && (
        <div className="rounded-lg bg-danger/15 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="mx-auto max-w-2xl">
        <Panel>
          <form className="space-y-5 p-6" onSubmit={handleSubmit}>
            <div>
              <label className={labelClass} htmlFor="title">
                Asunto
              </label>
              <input
                className={`${inputClass} mt-1.5`}
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
                className={`${inputClass} mt-1.5 min-h-44 resize-y`}
                id="description"
                name="description"
                onChange={handleChange}
                placeholder="Describe el problema detalladamente..."
                required
                value={form.description}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="category_id">
                  Categoria
                </label>
                <select
                  className={`${inputClass} mt-1.5`}
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
                  className={`${inputClass} mt-1.5`}
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
            </div>

            <div>
              <label className={labelClass} htmlFor="attachments">
                Adjuntos
              </label>
              <input
                className={`${inputClass} mt-1.5`}
                id="attachments"
                multiple
                onChange={(event) =>
                  setAttachments(Array.from(event.target.files ?? []))
                }
                type="file"
              />
              {attachments.length > 0 && (
                <p className="mt-2 text-xs text-muted">
                  {attachments.length} archivo(s) seleccionado(s)
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
                type="submit"
              >
                <Icon name="save" className="h-4 w-4" />
                {loading ? 'Creando...' : 'Crear ticket'}
              </button>
              <button
                className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-muted transition hover:bg-surface-hover"
                onClick={() => navigate('/tickets')}
                type="button"
              >
                Cancelar
              </button>
            </div>
          </form>
        </Panel>
      </div>
    </div>
  )
}

export default CreateTicketPage