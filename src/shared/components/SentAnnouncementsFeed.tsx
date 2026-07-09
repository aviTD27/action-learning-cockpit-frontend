import { useEffect, useState } from 'react'
import { Megaphone, Send, Users } from 'lucide-react'
import { getMySentAnnouncements } from '../../api/announcementsApi'
import type { SentAnnouncement, AnnouncementAudience } from '../../api/announcementsApi'

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

function audienceLabel(audience: AnnouncementAudience, cohortName?: string | null) {
  switch (audience) {
    case 'ALL_UNIVERSITY_STUDENTS':  return 'All university students'
    case 'ALL_UNIVERSITY_LECTURERS': return 'All university lecturers'
    case 'ALL_COHORT_STUDENTS': return cohortName ? `Cohort · ${cohortName}` : 'Cohort students'
    case 'SPECIFIC_STUDENTS': return 'Specific students'
    case 'SPECIFIC_LECTURERS': return 'Specific lecturers'
  }
}

interface Props {
  refreshKey?: number
}

export default function SentAnnouncementsFeed({ refreshKey = 0 }: Props) {
  const [items,    setItems]    = useState<SentAnnouncement[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    setLoading(true)
    getMySentAnnouncements()
      .then(setItems)
      .catch(() => setError('Failed to load sent announcements.'))
      .finally(() => setLoading(false))
  }, [refreshKey])

  if (loading) return <p style={{ padding: '1rem', color: '#9ca3af', fontSize: 13 }}>Loading sent announcements…</p>
  if (error)   return <p style={{ padding: '1rem', color: '#ef4444', fontSize: 13 }}>{error}</p>

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#9ca3af' }}>
        <Send size={28} strokeWidth={1.5} style={{ marginBottom: 8 }} />
        <p style={{ margin: 0, fontSize: 13 }}>No announcements sent yet.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {items.map((item, idx) => {
        const open = expanded === item.id
        return (
          <div
            key={item.id}
            style={{
              borderBottom: idx < items.length - 1 ? '1px solid #f3f4f6' : 'none',
              padding: '12px 16px',
              cursor: 'pointer',
              background: open ? '#fafafa' : '#fff',
              transition: 'background .12s',
            }}
            onClick={() => setExpanded(open ? null : item.id)}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{
                flexShrink: 0, width: 32, height: 32, borderRadius: '50%',
                background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Megaphone size={15} color="#7c3aed" />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#111827' }}>
                    {item.subject}
                  </span>
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 600, padding: '2px 7px', borderRadius: 999,
                    background: '#f3f4f6', color: '#6b7280', whiteSpace: 'nowrap',
                  }}>
                    {audienceLabel(item.audience, item.cohortName)}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 3 }}>
                  <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{timeAgo(item.sentAt)}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.72rem', color: '#6b7280' }}>
                    <Users size={11} /> {item.recipientCount} recipient{item.recipientCount === 1 ? '' : 's'}
                  </span>
                </div>

                {open && (
                  <div style={{
                    marginTop: 10, padding: '10px 12px',
                    background: '#f9fafb', borderRadius: 7,
                    border: '1px solid #e5e7eb',
                    fontSize: '0.82rem', color: '#374151',
                    lineHeight: 1.65, whiteSpace: 'pre-wrap',
                  }}>
                    {item.message}
                  </div>
                )}
              </div>

              <span style={{ flexShrink: 0, fontSize: '0.7rem', color: '#d1d5db', paddingTop: 2 }}>
                {open ? '▲' : '▼'}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
