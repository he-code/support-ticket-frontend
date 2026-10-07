import {
  LayoutDashboard,
  Ticket,
  Plus,
  LayoutGrid,
  Users,
  Bell,
  User,
  LogOut,
  Search,
  Filter,
  Upload,
  MessageSquare,
  Paperclip,
  Save,
  Trash2,
  Check,
  ArrowRight,
  RefreshCw,
  Shield,
  Clock,
  X,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Home,
  Menu,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const iconMap = {
  dashboard: LayoutDashboard,
  tickets: Ticket,
  plus: Plus,
  categories: LayoutGrid,
  users: Users,
  bell: Bell,
  user: User,
  logout: LogOut,
  search: Search,
  filter: Filter,
  upload: Upload,
  message: MessageSquare,
  paperclip: Paperclip,
  save: Save,
  trash: Trash2,
  check: Check,
  arrow: ArrowRight,
  refresh: RefreshCw,
  shield: Shield,
  clock: Clock,
  x: X,
  eye: Eye,
  eyeOff: EyeOff,
  lock: Lock,
  mail: Mail,
  home: Home,
  menu: Menu,
  moon: Moon,
  sun: Sun,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
}

export const inputClass =
  'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none transition placeholder:text-muted/50 focus:border-accent focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-50'

export const labelClass = 'text-sm font-medium text-text/80'

export function Icon({ name, className = 'h-4 w-4' }) {
  const LucideIcon = iconMap[name] ?? iconMap.tickets

  return <LucideIcon aria-hidden="true" className={className} />
}

const tone = {
  slate: 'bg-muted/10 text-muted',
  violet: 'bg-accent/10 text-accent',
  amber: 'bg-warning/10 text-warning',
  indigo: 'bg-accent/10 text-accent',
  rose: 'bg-danger/10 text-danger',
  sky: 'bg-info/10 text-info',
  emerald: 'bg-success/10 text-success',
  blue: 'bg-accent/10 text-accent',
  red: 'bg-danger/10 text-danger',
}

export function Badge({ children, tone: toneKey = 'slate' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tone[toneKey] ?? tone.slate}`}
    >
      {children}
    </span>
  )
}

export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-muted">
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
    <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center">
      <h2 className="text-base font-semibold text-text">{title}</h2>
      {description && (
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
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
      className={`rounded-xl border border-border bg-surface ${className}`}
    >
      {children}
    </section>
  )
}

export function FieldError({ message }) {
  if (!message) return null

  return (
    <p className="mt-1 text-xs font-medium text-danger" role="alert">
      {message}
    </p>
  )
}

export function SkeletonRows({ rows = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          className="h-12 rounded-lg skeleton-shimmer"
          key={index}
        />
      ))}
    </div>
  )
}