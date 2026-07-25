import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router'
import { Icon } from '../components/SupportUi'
import TopProgressBar from '../components/TopProgressBar'
import { useAuth } from '../context/AuthContext'
import { getInitials } from '../lib/formatters'
import { getRoleLabel } from '../lib/ticket'

const navigation = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'dashboard',
    roles: ['admin', 'support_agent', 'user'],
  },
  {
    name: 'Tickets',
    path: '/tickets',
    icon: 'tickets',
    roles: ['admin', 'support_agent', 'user'],
  },
  {
    name: 'Crear ticket',
    path: '/tickets/create',
    icon: 'plus',
    roles: ['admin', 'support_agent', 'user'],
  },
  {
    name: 'Categorias',
    path: '/categories',
    icon: 'categories',
    roles: ['admin', 'support_agent'],
  },
  {
    name: 'Usuarios',
    path: '/users',
    icon: 'users',
    roles: ['admin'],
  },
  {
    name: 'Notificaciones',
    path: '/notifications',
    icon: 'bell',
    roles: ['admin', 'support_agent', 'user'],
  },
  {
    name: 'Perfil',
    path: '/profile',
    icon: 'user',
    roles: ['admin', 'support_agent', 'user'],
  },
]

function DashboardLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const role = user?.role ?? 'user'

  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const availableNavigation = navigation.filter((item) =>
    item.roles.includes(role),
  )

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[var(--color-app)]">
      <TopProgressBar />
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-emerald-950/20 bg-[var(--color-sidebar)] text-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400 text-sm font-bold text-emerald-950">
                ST
              </div>
              <div>
                <h1 className="text-base font-bold">Support Tickets</h1>
                <p className="text-xs text-emerald-100/80">Mesa de soporte</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-4 py-5">
            {availableNavigation.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                    isActive
                      ? 'bg-lime-100 text-emerald-950'
                      : 'text-emerald-50/75 hover:bg-white/10 hover:text-white',
                  ].join(' ')
                }
                end={item.path === '/tickets'}
                key={item.path}
                to={item.path}
              >
                <Icon className="h-4 w-4 shrink-0" name={item.icon} />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-lime-100 text-sm font-bold text-emerald-950">
                {getInitials(user?.name ?? user?.email)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {user?.name ?? 'Usuario'}
                </p>
                <p className="truncate text-xs text-emerald-100/80">{user?.email}</p>
                <p className="mt-1 text-xs uppercase text-emerald-100/60">
                  {getRoleLabel(role)}
                </p>
              </div>
            </div>

            <button
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-emerald-50 transition hover:bg-white/10"
              onClick={() => setDark((d) => !d)}
              type="button"
            >
              {dark ? (
                <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              )}
              {dark ? 'Modo claro' : 'Modo oscuro'}
            </button>

            <button
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-emerald-50 transition hover:bg-white/10"
              onClick={handleLogout}
              type="button"
            >
              <Icon name="logout" />
              Cerrar sesion
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/95">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                Mesa de soporte
              </p>
              <h2 className="truncate text-lg font-semibold text-zinc-950 dark:text-zinc-100">
                {user?.name ?? user?.email ?? 'Usuario'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="hidden rounded-lg border border-zinc-300 p-2 text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 lg:inline-flex"
                onClick={() => setDark((d) => !d)}
                title={dark ? 'Modo claro' : 'Modo oscuro'}
                type="button"
              >
                {dark ? (
                  <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                ) : (
                  <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
              <button
                className="flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 lg:hidden"
                onClick={handleLogout}
                type="button"
              >
                <Icon name="logout" />
                Salir
              </button>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto border-t border-zinc-100 px-4 py-3 dark:border-zinc-800">
            {availableNavigation.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  [
                    'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold',
                    isActive
                      ? 'bg-emerald-700 text-white'
                      : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
                  ].join(' ')
                }
                end={item.path === '/tickets'}
                key={item.path}
                to={item.path}
              >
                <Icon className="h-4 w-4" name={item.icon} />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
