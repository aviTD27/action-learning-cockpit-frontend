import { useEffect, useState } from 'react'
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type NotificationItem,
} from '../api/studentApi'

export function useStudentNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState<string | null>(null)

  useEffect(() => {
    getMyNotifications()
      .then(setNotifications)
      .catch(() => setError('Failed to load notifications.'))
      .finally(() => setLoading(false))
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markRead = async (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    try {
      await markNotificationRead(id)
    } catch {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: false } : n))
    }
  }

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    try {
      await markAllNotificationsRead()
    } catch {
      getMyNotifications().then(setNotifications).catch(() => {})
    }
  }

  return { notifications, unreadCount, loading, error, markRead, markAllRead }
}
