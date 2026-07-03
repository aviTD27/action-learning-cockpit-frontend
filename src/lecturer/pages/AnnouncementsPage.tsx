import { useState } from 'react'
import { Megaphone, Plus, SendHorizonal } from 'lucide-react'
import AnnouncementInbox from '../../shared/components/AnnouncementInbox'
import SendAnnouncementModal from '../../shared/components/SendAnnouncementModal'
import '../styles/lecturer.css'

export default function LecturerAnnouncementsPage() {
  const [modalOpen,  setModalOpen]  = useState(false)
  const [sentKey,    setSentKey]    = useState(0)
  const [sentBanner, setSentBanner] = useState(false)

  const handleSent = () => {
    setSentKey(k => k + 1)
    setSentBanner(true)
    setTimeout(() => setSentBanner(false), 4000)
  }

  return (
    <div className="ua-page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Megaphone size={16} /> Announcements
          </h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280', marginTop: 2 }}>
            Send announcements to students · View messages from admin
          </p>
        </div>
        <button className="ua-btn ua-btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={13} /> New Announcement
        </button>
      </div>

      {sentBanner && (
        <div style={{ marginBottom: '1rem', padding: '.75rem 1rem', background: '#dcfce7', borderRadius: 8, color: '#16a34a', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <SendHorizonal size={16} /> Announcement sent successfully.
        </div>
      )}

      <AnnouncementInbox key={sentKey} recipientRole="ROLE_LECTURER" />

      <SendAnnouncementModal
        role="LECTURER"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSent={handleSent}
      />
    </div>
  )
}
