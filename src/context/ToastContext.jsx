/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useState } from 'react'

const ToastContext = createContext(null)

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = ++toastId
    setToasts((current) => [...current, { id, message, type }])

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }

    return id
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <div
        aria-label="Notificaciones"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-sm:inset-x-4 max-sm:bottom-4 sm:max-w-sm"
        role="status"
      >
        {toasts.map((toast) => (
          <div
            className={`flex items-start gap-3 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ring-1 ring-inset transition-all animate-in slide-in-from-right-2 ${
              toast.type === 'error'
                ? 'bg-rose-600 text-white ring-rose-400'
                : toast.type === 'notice'
                  ? 'bg-sky-600 text-white ring-sky-400'
                  : 'bg-emerald-600 text-white ring-emerald-400'
            }`}
            key={toast.id}
          >
            <span className="flex-1">{toast.message}</span>
            <button
              className="-mr-1 -mt-1 grid h-6 w-6 place-items-center rounded text-white/80 hover:text-white"
              onClick={() => removeToast(toast.id)}
              type="button"
            >
              <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6L6 18" /><path d="M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
