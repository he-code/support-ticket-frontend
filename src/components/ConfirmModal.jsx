import { useEffect, useRef } from 'react'
import { Icon } from './SupportUi'

function ConfirmModal({ title, description, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', tone = 'rose', loading = false, onConfirm, onCancel }) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={loading ? undefined : onCancel}
      role="dialog"
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-zinc-800 dark:ring-1 dark:ring-zinc-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
            tone === 'rose' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-300' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300'
          }`}>
            <Icon className="h-5 w-5" name="trash" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-100">{title}</h3>
            {description && <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
            disabled={loading}
            onClick={onCancel}
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
              tone === 'rose'
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
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

export default ConfirmModal



