const iconPaths = {
  dashboard: [
    'M3 13h8V3H3v10z',
    'M13 21h8v-8h-8v8z',
    'M13 3v8h8V3h-8z',
    'M3 21h8v-6H3v6z',
  ],
  tickets: ['M5 4h14v16H5V4z', 'M8 8h8', 'M8 12h8', 'M8 16h5'],
  plus: ['M12 5v14', 'M5 12h14'],
  categories: [
    'M4 5h7v7H4V5z',
    'M13 5h7v7h-7V5z',
    'M4 14h7v5H4v-5z',
    'M13 14h7v5h-7v-5z',
  ],
  users: [
    'M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2',
    'M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    'M21 21v-2a4 4 0 0 0-3-3.87',
    'M16 3.13a4 4 0 0 1 0 7.75',
  ],
  bell: [
    'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9',
    'M13.73 21a2 2 0 0 1-3.46 0',
  ],
  user: ['M20 21a8 8 0 0 0-16 0', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  logout: ['M10 17l5-5-5-5', 'M15 12H3', 'M21 3v18h-7'],
  search: ['M21 21l-4.35-4.35', 'M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z'],
  filter: ['M4 5h16', 'M7 12h10', 'M10 19h4'],
  upload: ['M12 16V4', 'M7 9l5-5 5 5', 'M5 20h14'],
  message: [
    'M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z',
  ],
  paperclip: [
    'M21 12.5l-8.49 8.49a5 5 0 0 1-7.07-7.07l9.19-9.19a3 3 0 0 1 4.24 4.24l-9.19 9.19a1 1 0 0 1-1.41-1.41L16.76 8.25',
  ],
  save: [
    'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z',
    'M17 21v-8H7v8',
    'M7 3v5h8',
  ],
  trash: ['M3 6h18', 'M8 6V4h8v2', 'M19 6l-1 14H6L5 6'],
  check: ['M20 6L9 17l-5-5'],
  arrow: ['M5 12h14', 'M13 5l7 7-7 7'],
  refresh: [
    'M21 12a9 9 0 0 1-15.36 6.36',
    'M3 12a9 9 0 0 1 15.36-6.36',
    'M3 21v-6h6',
    'M21 3v6h-6',
  ],
  shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  clock: ['M12 8v5l3 3', 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'],
}

const toneClasses = {
  slate: 'bg-zinc-100 text-zinc-700 ring-zinc-200',
  sky: 'bg-sky-50 text-sky-700 ring-sky-200',
  amber: 'bg-amber-50 text-amber-800 ring-amber-200',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  rose: 'bg-rose-50 text-rose-700 ring-rose-200',
  violet: 'bg-violet-50 text-violet-700 ring-violet-200',
}

export const inputClass =
  'w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-zinc-100'

export const labelClass = 'text-sm font-medium text-zinc-700'

export function Icon({ name, className = 'h-4 w-4' }) {
  const paths = iconPaths[name] ?? iconPaths.tickets

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths.map((path) => (
        <path d={path} key={path} />
      ))}
    </svg>
  )
}

export function Badge({ children, tone = 'slate' }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${toneClasses[tone] ?? toneClasses.slate}`}
    >
      {children}
    </span>
  )
}

export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-normal text-zinc-950">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-zinc-500">
            {description}
          </p>
        )}
      </div>

      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-white px-6 py-10 text-center">
      <h2 className="text-base font-semibold text-zinc-950">{title}</h2>
      {description && (
        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
          {description}
        </p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}

export function Panel({ children, className = '' }) {
  return (
    <section
      className={`rounded-lg border border-zinc-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </section>
  )
}

export function SkeletonRows({ rows = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          className="h-12 animate-pulse rounded-md bg-zinc-100"
          key={index}
        />
      ))}
    </div>
  )
}
