import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../api/support'
import {
  Badge,
  EmptyState,
  Icon,
  PageHeader,
  Panel,
  SkeletonRows,
} from '../components/SupportUi'
import { useAsync } from '../hooks/useAsync'
import { useMutation } from '../hooks/useMutation'
import { useToast } from '../context/ToastContext'
import { collectionFromPayload } from '../lib/normalizers'
import { formatDate } from '../lib/formatters'

function NotificationsPage() {
  const { data, loading, error, setData } = useAsync(async () => {
    return collectionFromPayload(await listNotifications({ per_page: 100 }))
  }, [])
  const notifications = data ?? []
  const { saving, execute } = useMutation()
  const { showToast } = useToast()

  const markRead = async (notification) => {
    try {
      await execute(markNotificationRead, notification.id)
      setData((current) =>
        (current ?? []).map((item) =>
          item.id === notification.id
            ? { ...item, read_at: item.read_at ?? new Date().toISOString() }
            : item,
        ),
      )
      showToast('Notificación marcada.')
    } catch {
      // error handled by useMutation
    }
  }

  const markAllRead = async () => {
    try {
      await execute(markAllNotificationsRead)
      setData((current) =>
        (current ?? []).map((item) => ({
          ...item,
          read_at: item.read_at ?? new Date().toISOString(),
        })),
      )
      showToast('Notificaciónes actualizadas.')
    } catch {
      // error handled by useMutation
    }
  }

  const unreadCount = notifications.filter((item) => !item.read_at).length

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          unreadCount > 0 && (
            <button
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-semibold text-muted transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
              disabled={saving}
              onClick={markAllRead}
              type="button"
            >
              <Icon name="check" className="h-4 w-4" />
              Marcar todas como leídas
            </button>
          )
        }
        description={`${unreadCount} pendientes`}
        title="Notificaciónes"
      />

      {error && (
        <div className="rounded-lg bg-danger/15 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <Panel>
        <div className="p-5">
          {loading ? (
            <SkeletonRows rows={6} />
          ) : notifications.length === 0 ? (
            <EmptyState
              description="Sin avisos recientes."
              title="Sin notificaciónes"
            />
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => {
                const read = Boolean(notification.read_at)
                const title =
                  notification.title ??
                  notification.data?.title ??
                  notification.type ??
                  'Notificación'
                const message =
                  notification.message ??
                  notification.data?.message ??
                  notification.body ??
                  ''

                return (
                  <article
                    className="grid gap-4 py-4 md:grid-cols-[1fr_auto] md:items-center"
                    key={notification.id}
                  >
                    <div className="flex gap-3">
                      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${read ? 'bg-surface-hover text-muted' : 'bg-accent text-white'}`}>
                        <Icon name="bell" className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-text">{title}</p>
                          <Badge tone={read ? 'slate' : 'violet'}>
                            {read ? 'Leída' : 'Nueva'}
                          </Badge>
                        </div>
                        {message && (
                          <p className="mt-1 text-sm text-muted">
                            {message}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-muted">
                          {formatDate(notification.created_at)}
                        </p>
                      </div>
                    </div>

                    {!read && (
                      <button
                        className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={saving}
                        onClick={() => markRead(notification)}
                        type="button"
                      >
                        Marcar leída
                      </button>
                    )}
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </Panel>
    </div>
  )
}

export default NotificationsPage