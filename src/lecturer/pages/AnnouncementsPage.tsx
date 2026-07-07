import { useState } from 'react'
import { Megaphone, Plus, SendHorizonal, Inbox } from 'lucide-react'
import AnnouncementInbox from '../../shared/components/AnnouncementInbox'
import SentAnnouncementsFeed from '../../shared/components/SentAnnouncementsFeed'
import SendAnnouncementModal from '../../shared/components/SendAnnouncementModal'
import '../styles/lecturer.css'

type Tab = 'inbox' | 'sent'

export default function LecturerAnnouncementsPage() {
  const [tab,        setTab]        = useState<Tab>('inbox')
  const [modalOpen,  setModalOpen]  = useState(false)
  const [sentBanner, setSentBanner] = useState(false)
  const [inboxKey]                  = useState(0)
  const [sentKey,    setSentKey]    = useState(0)

  const handleSent = () => {
    setSentKey(k => k + 1)
    setSentBanner(true)
    setTimeout(() => setSentBanner(false), 4000)
    setTab('sent')
  }

  return (
    <div className="ua-page" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Megaphone size={16} /> Announcements
          </h2>
          <p style={{ margin: 0, fontSize: '0.78rem', color: '#6b7280', marginTop: 2 }}>
            View messages from admin · Send announcements to students
          </p>
        </div>
        <button className="ua-btn ua-btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={13} /> New Announcement
        </button>
      </div>

      {sentBanner && (
        <div style={{ flexShrink: 0, padding: '.75rem 1rem', background: '#dcfce7', borderRadius: 8, color: '#16a34a', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <SendHorizonal size={16} /> Announcement sent. View it in the Sent tab.
        </div>
      )}

      {/* Tabs */}
      <div style={{ flexShrink: 0, display: 'flex', gap: 2, background: '#f3f4f6', padding: 4, borderRadius: 9, width: 'fit-content' }}>
        {([
          { id: 'inbox', label: 'From Admin',        icon: Inbox       },
          { id: 'sent',  label: 'Sent to Students',  icon: SendHorizonal },
        ] as { id: Tab; label: string; icon: React.ElementType }[]).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 600,
              background: tab === t.id ? '#fff' : 'transparent',
              color: tab === t.id ? '#111827' : '#6b7280',
              boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
              transition: 'all .12s',
            }}
          >
            <t.icon size={13} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {tab === 'inbox' && (
          <AnnouncementInbox key={inboxKey} recipientRole="ROLE_LECTURER" />
        )}
        {tab === 'sent' && (
          <div className="ua-card" style={{ padding: 0, overflow: 'hidden' }}>
            <SentAnnouncementsFeed refreshKey={sentKey} />
          </div>
        )}
      </div>

      <SendAnnouncementModal
        role="LECTURER"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSent={handleSent}
      />
    </div>
  )
}
