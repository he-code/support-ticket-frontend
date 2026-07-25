import { useEffect } from 'react'

const isFormField = (element) => {
  const tag = element?.tagName?.toLowerCase()
  return tag === 'input' || tag === 'textarea' || tag === 'select' || element?.isContentEditable
}

export function useKeyboardShortcuts(shortcuts, deps = []) {
  useEffect(() => {
    const handler = (event) => {
      if (isFormField(event.target)) return

      for (const { key, ctrl = false, shift = false, alt = false, action } of shortcuts) {
        if (
          event.key === key &&
          event.ctrlKey === ctrl &&
          event.shiftKey === shift &&
          event.altKey === alt
        ) {
          event.preventDefault()
          action(event)
          return
        }
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [shortcuts, ...deps]) // eslint-disable-line react-hooks/exhaustive-deps
}
