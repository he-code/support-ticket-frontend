import { useEffect, useRef } from 'react'
import { Icon } from './SupportUi'

export default function ConfirmModal({ title, description, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', tone = 'rose', loading = false, onConfirm, onCancel }) {
  const confirmRef = useRef(null)

  useEffect(() => {
    confirmRef.current?.focus()
  }, [])

  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'Escape' && !loading) onCancel()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onCancel, loading])

  const iconBg = tone === 'rose'
    ? 'bg-danger/10 text-danger'
    : 'bg-warning/10 text-warning'

  const confirmBg = tone === 'rose'
    ? 'bg-danger hover:bg-danger/90'
    : 'bg-warning hover:bg-warning/90'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={loading ? undefined : onCancel}
      role="dialog"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${iconBg}`}>
            <Icon className="h-5 w-5" name="trash" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-text">{title}</h3>
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            onClick={onCancel}
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${confirmBg}`}
            disabled={loading}
            onClick={onConfirm}
            ref={confirmRef}
            type="button"
          >
            {loading ? 'Procesando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}