import { Icon } from './SupportUi'

function PageButton({ page, active, onClick }) {
  if (active) {
    return (
      <span className="grid h-9 w-9 place-items-center rounded-md bg-emerald-700 text-xs font-bold text-white dark:bg-emerald-600">
        {page}
      </span>
    )
  }

  return (
    <button
      className="grid h-9 w-9 place-items-center rounded-md border border-zinc-300 bg-white text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
      onClick={() => onClick(page)}
      type="button"
    >
      {page}
    </button>
  )
}

function PaginationBar({ page, totalPages, total, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, page + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-700">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{total} resultados</p>

      <div className="flex items-center gap-1">
        <button
          className="grid h-9 w-9 place-items-center rounded-md border border-zinc-300 bg-white text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          type="button"
        >
          <Icon className="h-3 w-3" name="arrow" />
        </button>

        {start > 1 && (
          <>
            <PageButton onClick={onPageChange} page={1} />
            {start > 2 && <span className="px-1 text-xs text-zinc-400 dark:text-zinc-500">...</span>}
          </>
        )}

        {pages.map((p) => (
          <PageButton active={p === page} key={p} onClick={onPageChange} page={p} />
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1 text-xs text-zinc-400 dark:text-zinc-500">...</span>}
            <PageButton onClick={onPageChange} page={totalPages} />
          </>
        )}

        <button
          className="grid h-9 w-9 place-items-center rounded-md border border-zinc-300 bg-white text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          type="button"
        >
          <Icon className="h-3 w-3 rotate-180" name="arrow" />
        </button>
      </div>
    </div>
  )
}

export default PaginationBar
