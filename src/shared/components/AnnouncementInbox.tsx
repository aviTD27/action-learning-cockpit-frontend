import { useEffect, useState } from 'react'
import { CheckCheck, Megaphone } from 'lucide-react'
import {
  getMyAnnouncements,
  markStudentAnnouncementRead,
  markLecturerAnnouncementRead,
  markAllAnnouncementsRead,
} from '../../api/announcementsApi'
import type { AnnouncementInboxItem } from '../../api/announcementsApi'
import '../../student/styles/notifications.css'

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1)  return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7)  return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function senderLabel(role: string, name: string) {
  if (role === 'ROLE_UNI_ADMIN') return `Admin · ${name}`
  if (role === 'ROLE_LECTURER')  return `Lecturer · ${name}`
  return name
}

interface Props {
  recipientRole: 'ROLE_STUDENT' | 'ROLE_LECTURER'
}

export default function AnnouncementInbox({ recipientRole }: Props) {
  const [items,   setItems]   = useState<AnnouncementInboxItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const [filter,  setFilter]  = useState<'all' | 'unread'>('all')

  useEffect(() => {
    getMyAnnouncements()
      .then(setItems)
      .catch(() => setError('Failed to load announcements.'))
      .finally(() => setLoading(false))
  }, [])

  const unreadCount = items.filter(i => !i.read).length
  const visible = filter === 'unread' ? items.filter(i => !i.read) : items

  const markRead = async (item: AnnouncementInboxItem) => {
    if (item.read) return
    setItems(prev => prev.map(i => i.recipientId === item.recipientId ? { ...i, read: true } : i))
    try {
      if (recipientRole === 'ROLE_STUDENT') {
        await markStudentAnnouncementRead(item.recipientId)
      } else {
        await markLecturerAnnouncementRead(item.recipientId)
      }
    } catch {
      setItems(prev => prev.map(i => i.recipientId === item.recipientId ? { ...i, read: false } : i))
    }
  }

  const markAll = async () => {
    setItems(prev => prev.map(i => ({ ...i, read: true })))
    try {
      await markAllAnnouncementsRead()
    } catch {
      getMyAnnouncements().then(setItems).catch(() => {})
    }
  }

  if (loading) return <p className="ua-table-empty">Loading announcements…</p>
  if (error)   return <p className="ua-table-empty">{error}</p>

  return (
    <div>
      <div className="notif-controls" style={{ marginBottom: '1rem' }}>
        <div className="notif-tabs">
          {(['all', 'unread'] as const).map(t => (
            <button key={t}
              className={`notif-tab ${filter === t ? 'active' : ''}`}
              onClick={() => setFilter(t)}>
              {t === 'all' ? 'All' : 'Unread'}
              <span className="notif-tab-count">
                {t === 'all' ? items.length : unreadCount}
              </span>
            </button>
          ))}
        </div>
        <button className="notif-mark-all" onClick={markAll} disabled={unreadCount === 0}>
          <CheckCheck size={14} /> Mark all as read
        </button>
      </div>

      <div className="sd-card" style={{ padding: 0, overflow: 'hidden' }}>
        {visible.length === 0 ? (
          <div className="notif-empty">
            <Megaphone size={28} />
            <span>{filter === 'unread' ? 'No unread announcements.' : 'No announcements yet.'}</span>
          </div>
        ) : (
          <div className="notif-feed">
            {visible.map(item => (
              <div
                key={item.recipientId}
                className={`notif-item ${!item.read ? 'unread' : ''}`}
                onClick={() => markRead(item)}
              >
                <div className="notif-icon"
                  style={{ background: item.senderRole === 'ROLE_UNI_ADMIN' ? '#ede9fe' : '#dbeafe' }}>
                  <Megaphone size={16}
                    color={item.senderRole === 'ROLE_UNI_ADMIN' ? '#7c3aed' : '#1d4ed8'} />
                </div>
                <div className="notif-content">
                  <div className="notif-message" style={{ fontWeight: item.read ? 400 : 600 }}>
                    {item.subject}
                  </div>
                  <div className="notif-sub" style={{ marginBottom: 4, whiteSpace: 'pre-wrap', color: '#374151' }}>
                    {item.message}
                  </div>
                  <div className="notif-sub">
                    From: <strong>{senderLabel(item.senderRole, item.senderName)}</strong>
                  </div>
                  <div className="notif-time">{timeAgo(item.sentAt)}</div>
                </div>
                {!item.read && <div className="notif-dot" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
