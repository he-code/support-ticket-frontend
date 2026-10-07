import { Icon } from './SupportUi'

function PageButton({ page, active, onClick }) {
  if (active) {
    return (
      <span
        aria-current="page"
        className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-xs font-bold text-white"
      >
        {page}
      </span>
    )
  }

  return (
    <button
      aria-label={`Pagina ${page}`}
      className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface text-xs font-semibold text-muted transition hover:bg-surface-hover hover:text-text"
      onClick={() => onClick(page)}
      type="button"
    >
      {page}
    </button>
  )
}

function PaginationBar({ page, totalPages, total, onPageChange }) {
  if (totalPages <= 1) return null

  const current = Math.min(Math.max(1, page), totalPages)
  const pages = []
  const start = Math.max(1, current - 2)
  const end = Math.min(totalPages, current + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-between border-t border-border pt-4">
      <p className="text-xs text-muted">{total} resultados</p>

      <div className="flex items-center gap-1">
        <button
          aria-label="Página anterior"
          className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface text-xs font-semibold text-muted transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
          disabled={current <= 1}
          onClick={() => onPageChange(current - 1)}
          type="button"
        >
          <Icon className="h-3 w-3" name="chevronLeft" />
        </button>

        {start > 1 && (
          <>
            <PageButton onClick={onPageChange} page={1} />
            {start > 2 && <span className="px-1 text-xs text-muted">...</span>}
          </>
        )}

        {pages.map((p) => (
          <PageButton active={p === current} key={p} onClick={onPageChange} page={p} />
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1 text-xs text-muted">...</span>}
            <PageButton onClick={onPageChange} page={totalPages} />
          </>
        )}

        <button
          aria-label="Página siguiente"
          className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface text-xs font-semibold text-muted transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
          disabled={current >= totalPages}
          onClick={() => onPageChange(current + 1)}
          type="button"
        >
          <Icon className="h-3 w-3" name="chevronRight" />
        </button>
      </div>
    </div>
  )
}

export default PaginationBar