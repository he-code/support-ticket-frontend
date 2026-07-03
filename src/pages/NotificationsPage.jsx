import { useCallback, useEffect, useState } from 'react'
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
import { collectionFromPayload, formatDate } from '../lib/support'

function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadNotifications = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await listNotifications()
      setNotifications(collectionFromPayload(data))
    } catch {
      setError('No se pudieron cargar las notificaciones.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    Promise.resolve().then(() => {
      if (!cancelled) loadNotifications()
    })

    return () => {
      cancelled = true
    }
  }, [loadNotifications])

  const markRead = async (notification) => {
    setSaving(true)
    setNotice('')
    setError('')

    try {
      await markNotificationRead(notification.id)
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? { ...item, read_at: item.read_at ?? new Date().toISOString() }
            : item,
        ),
      )
      setNotice('Notificacion marcada.')
    } catch {
      setError('No se pudo actualizar la notificacion.')
    } finally {
      setSaving(false)
    }
  }

  const markAllRead = async () => {
    setSaving(true)
    setNotice('')
    setError('')

    try {
      await markAllNotificationsRead()
      setNotifications((current) =>
        current.map((item) => ({
          ...item,
          read_at: item.read_at ?? new Date().toISOString(),
        })),
      )
      setNotice('Notificaciones actualizadas.')
    } catch {
      setError('No se pudieron actualizar las notificaciones.')
    } finally {
      setSaving(false)
    }
  }

  const unreadCount = notifications.filter((item) => !item.read_at).length

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <button
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={saving || notifications.length === 0}
            onClick={markAllRead}
            type="button"
          >
            <Icon name="check" />
            Marcar todas
          </button>
        }
        description={`${unreadCount} pendientes`}
        title="Notificaciones"
      />

      {notice && (
        <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {notice}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <Panel>
        <div className="p-5">
          {loading ? (
            <SkeletonRows rows={6} />
          ) : notifications.length === 0 ? (
            <EmptyState
              description="Sin avisos recientes de la API."
              title="Sin notificaciones"
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notification) => {
                const read = Boolean(notification.read_at)
                const title =
                  notification.title ??
                  notification.data?.title ??
                  notification.type ??
                  'Notificacion'
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
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-700 text-white">
                        <Icon name="bell" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-zinc-950">{title}</p>
                          <Badge tone={read ? 'slate' : 'sky'}>
                            {read ? 'Leida' : 'Nueva'}
                          </Badge>
                        </div>
                        {message && (
                          <p className="mt-1 text-sm text-slate-600">
                            {message}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-slate-400">
                          {formatDate(notification.created_at)}
                        </p>
                      </div>
                    </div>

                    {!read && (
                      <button
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={saving}
                        onClick={() => markRead(notification)}
                        type="button"
                      >
                        Marcar leida
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
