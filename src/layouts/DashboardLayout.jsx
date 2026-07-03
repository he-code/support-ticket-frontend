import { NavLink, Outlet, useNavigate } from 'react-router'
import { Icon } from '../components/SupportUi'
import { useAuth } from '../context/AuthContext'
import { getInitials, getRoleLabel } from '../lib/support'

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

  const availableNavigation = navigation.filter((item) =>
    item.roles.includes(role),
  )

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#f6f7f2]">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-emerald-950/20 bg-[#10231f] text-white lg:block">
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
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-emerald-50 transition hover:bg-white/10"
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
        <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Mesa de soporte
              </p>
              <h2 className="truncate text-lg font-semibold text-zinc-950">
                {user?.name ?? user?.email ?? 'Usuario'}
              </h2>
            </div>

            <button
              className="flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 lg:hidden"
              onClick={handleLogout}
              type="button"
            >
              <Icon name="logout" />
              Salir
            </button>
          </div>

          <nav className="flex gap-2 overflow-x-auto border-t border-zinc-100 px-4 py-3 lg:hidden">
            {availableNavigation.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  [
                    'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold',
                    isActive
                      ? 'bg-emerald-700 text-white'
                      : 'bg-zinc-100 text-zinc-700',
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
