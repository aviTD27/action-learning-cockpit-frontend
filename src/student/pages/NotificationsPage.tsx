import { useState } from 'react'
import { AlertCircle, Bell, BookOpen, Check, CheckCheck, Clock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useStudentNotifications } from '../hooks/useStudentNotifications'
import type { NotificationItem } from '../api/studentApi'
import '../styles/student.css'
import '../styles/notifications.css'

type FilterTab = 'all' | 'unread'

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1)  return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7)  return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

type TypeConfig = { icon: LucideIcon; color: string; bg: string }

function typeConfig(type: string): TypeConfig {
  switch (type) {
    case 'NEW_SUBMISSION':
      return { icon: BookOpen, color: '#1d4ed8', bg: '#dbeafe' }
    case 'MANUAL':
      return { icon: Bell, color: '#7c3aed', bg: '#ede9fe' }
    case 'REMINDER_24H':
      return { icon: Clock, color: '#ea580c', bg: '#ffedd5' }
    case 'REMINDER_12H':
      return { icon: Clock, color: '#c2410c', bg: '#fee2e2' }
    case 'REMINDER_1H':
      return { icon: AlertCircle, color: '#dc2626', bg: '#fee2e2' }
    default:
      return { icon: Bell, color: '#6b7280', bg: '#f3f4f6' }
  }
}

function NotifItem({
  n, onRead,
}: { n: NotificationItem; onRead: (id: number) => void }) {
  const { icon: Icon, color, bg } = typeConfig(n.type)

  return (
    <div
      className={`notif-item ${!n.read ? 'unread' : ''}`}
      onClick={() => { if (!n.read) onRead(n.id) }}
    >
      <div className="notif-icon" style={{ backgroundColor: bg }}>
        <Icon size={16} color={color} />
      </div>
      <div className="notif-content">
        <div className="notif-message">{n.message}</div>
        {n.submissionTitle && (
          <div className="notif-sub">
            Assignment: <strong>{n.submissionTitle}</strong>
          </div>
        )}
        <div className="notif-time">{timeAgo(n.createdAt)}</div>
      </div>
      {!n.read && <div className="notif-dot" />}
    </div>
  )
}

export default function NotificationsPage() {
  const { notifications, unreadCount, loading, error, markRead, markAllRead } =
    useStudentNotifications()
  const [filter, setFilter] = useState<FilterTab>('all')

  const filtered =
    filter === 'unread' ? notifications.filter(n => !n.read) : notifications

  if (loading) return <p className="sd-table-empty">Loading notifications…</p>
  if (error)   return <p className="sd-table-empty">{error}</p>

  return (
    <div className="sd-page">
      <div className="notif-controls">
        <div className="notif-tabs">
          {(['all', 'unread'] as FilterTab[]).map(t => (
            <button
              key={t}
              className={`notif-tab ${filter === t ? 'active' : ''}`}
              onClick={() => setFilter(t)}
            >
              {t === 'all' ? 'All' : 'Unread'}
              <span className="notif-tab-count">
                {t === 'all' ? notifications.length : unreadCount}
              </span>
            </button>
          ))}
        </div>

        <button
          className="notif-mark-all"
          onClick={markAllRead}
          disabled={unreadCount === 0}
        >
          <CheckCheck size={14} />
          Mark all as read
        </button>
      </div>

      <div className="sd-card">
        {filtered.length === 0 ? (
          <div className="notif-empty">
            <Check size={28} />
            <span>
              {filter === 'unread'
                ? 'No unread notifications.'
                : 'No notifications yet.'}
            </span>
          </div>
        ) : (
          <div className="notif-feed">
            {filtered.map(n => (
              <NotifItem key={n.id} n={n} onRead={markRead} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
