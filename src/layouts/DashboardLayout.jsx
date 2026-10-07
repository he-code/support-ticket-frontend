import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router'
import { Icon } from '../components/SupportUi'
import TopProgressBar from '../components/TopProgressBar'
import { useAuth } from '../context/AuthContext'
import { getInitials } from '../lib/formatters'
import { getRoleLabel } from '../lib/ticket'

const navigation = [
  { name: 'Dashboard', path: '/dashboard', icon: 'dashboard', roles: ['admin', 'support_agent', 'user'] },
  { name: 'Tickets', path: '/tickets', icon: 'tickets', roles: ['admin', 'support_agent', 'user'] },
  { name: 'Nuevo ticket', path: '/tickets/create', icon: 'plus', roles: ['admin', 'support_agent', 'user'] },
  { name: 'Categorías', path: '/categories', icon: 'categories', roles: ['admin', 'support_agent'] },
  { name: 'Usuarios', path: '/users', icon: 'users', roles: ['admin'] },
  { name: 'Notificaciones', path: '/notifications', icon: 'bell', roles: ['admin', 'support_agent', 'user'] },
  { name: 'Perfil', path: '/profile', icon: 'user', roles: ['admin', 'support_agent', 'user'] },
]

const mobileNav = [
  { name: 'Inicio', path: '/dashboard', icon: 'dashboard' },
  { name: 'Tickets', path: '/tickets', icon: 'tickets' },
  { name: 'Nuevo', path: '/tickets/create', icon: 'plus' },
  { name: 'Perfil', path: '/profile', icon: 'user' },
]

function DashboardLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const role = user?.role ?? 'user'

  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true'
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        setCollapsed((c) => {
          const next = !c
          localStorage.setItem('sidebar_collapsed', String(next))
          return next
        })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const availableNavigation = navigation.filter((item) =>
    item.roles.includes(role),
  )

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c
      localStorage.setItem('sidebar_collapsed', String(next))
      return next
    })
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const sidebarWidth = collapsed ? 'w-16' : 'w-64'

  return (
    <div className="min-h-screen bg-bg">
      <TopProgressBar />
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-border bg-surface transition-all duration-200 lg:block ${sidebarWidth}`}
      >
        <div className="flex h-full flex-col">
          <div className={`flex items-center gap-3 border-b border-border px-4 py-4 ${collapsed ? 'justify-center' : ''}`}>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent text-sm font-bold text-white shadow-lg shadow-accent/20">
              ST
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h1 className="text-base font-semibold text-text">Support Tickets</h1>
                <p className="text-xs text-muted">v1.0</p>
              </div>
            )}
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {availableNavigation.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    collapsed ? 'justify-center' : '',
                    isActive
                      ? 'bg-accent/15 text-accent border-l-[3px] border-accent -ml-[12px] pl-[9px]'
                      : 'text-muted hover:bg-surface-hover hover:text-text',
                  ].join(' ')
                }
                end={item.path === '/tickets'}
                key={item.path}
                to={item.path}
                title={collapsed ? item.name : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" name={item.icon} />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-border p-3">
            {!collapsed && (
              <>
                <div className="flex items-center gap-3 rounded-lg bg-surface-hover/50 p-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent/20 text-sm font-bold text-accent">
                    {getInitials(user?.name ?? user?.email)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text">
                      {user?.name ?? 'Usuario'}
                    </p>
                    <p className="truncate text-xs text-muted">{user?.email}</p>
                    <p className="mt-0.5 text-xs uppercase text-muted">
                      {getRoleLabel(role)}
                    </p>
                  </div>
                </div>

                <button
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted transition hover:bg-surface-hover"
                  onClick={handleLogout}
                  type="button"
                >
                  <Icon name="logout" className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </>
            )}

            <button
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-2 py-2 text-sm text-muted transition hover:bg-surface-hover"
              onClick={toggleCollapsed}
              title={collapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
              type="button"
            >
              <Icon name={collapsed ? 'chevronRight' : 'chevronLeft'} className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className={`transition-all duration-200 ${collapsed ? 'lg:pl-16' : 'lg:pl-64'}`}>
        <header className="sticky top-0 z-30 border-b border-border bg-bg/95 backdrop-blur">
          <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              className="inline-flex items-center gap-2 rounded-lg p-2 text-muted transition hover:text-text lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              type="button"
            >
              <Icon name="menu" />
            </button>

            <div className="flex flex-1 items-center justify-end gap-3">
              <button
                className="hidden rounded-lg p-2 text-muted transition hover:text-text lg:inline-flex items-center gap-2"
                onClick={toggleCollapsed}
                title={collapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral (Ctrl+B)'}
                type="button"
              >
                <Icon name="menu" />
              </button>

              <button
                className="rounded-lg p-2 text-muted transition hover:text-text"
                title="Notificaciones"
                type="button"
                onClick={() => navigate('/notifications')}
              >
                <Icon name="bell" className="h-4 w-4" />
              </button>

              <button
                className="flex items-center gap-2 rounded-lg p-2 text-muted transition hover:text-text"
                onClick={() => navigate('/profile')}
                title="Perfil"
                type="button"
              >
                <div className="grid h-8 w-8 place-items-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                  {getInitials(user?.name ?? user?.email)}
                </div>
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 animate-fade-in">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface lg:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileNav.map((item) => (
            <NavLink
              className={({ isActive }) =>
                [
                  'flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs font-medium transition',
                  isActive ? 'text-accent' : 'text-muted',
                ].join(' ')
              }
              end={item.path === '/tickets'}
              key={item.path}
              to={item.path}
            >
              <Icon className="h-5 w-5" name={item.icon} />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="pb-16 lg:pb-0" />

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <aside
            className="fixed inset-y-0 left-0 w-64 bg-surface border-r border-border animate-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-border px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-sm font-bold text-white">
                    ST
                  </div>
                  <span className="font-semibold text-text">Support Tickets</span>
                </div>
                <button
                  className="rounded-lg p-2 text-muted hover:text-text"
                  onClick={() => setSidebarOpen(false)}
                  type="button"
                >
                  <Icon name="x" className="h-4 w-4" />
                </button>
              </div>

              <nav className="flex-1 space-y-1 px-3 py-4">
                {availableNavigation.map((item) => (
                  <NavLink
                    className={({ isActive }) =>
                      [
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-accent/15 text-accent'
                          : 'text-muted hover:bg-surface-hover hover:text-text',
                      ].join(' ')
                    }
                    end={item.path === '/tickets'}
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="h-4 w-4 shrink-0" name={item.icon} />
                    {item.name}
                  </NavLink>
                ))}
              </nav>

              <div className="border-t border-border p-4">
                <button
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted transition hover:bg-surface-hover"
                  onClick={() => { handleLogout(); setSidebarOpen(false) }}
                  type="button"
                >
                  <Icon name="logout" className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

export default DashboardLayout