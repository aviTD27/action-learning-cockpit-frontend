import { useState } from 'react'
import { Megaphone, Plus, SendHorizonal } from 'lucide-react'
import Layout from '../../shared/layout/Layout'
import { UNI_ADMIN_NAV } from '../nav'
import { useUniAdminSidebarUser } from '../hooks/useUniAdminSidebarUser'
import SendAnnouncementModal from '../../shared/components/SendAnnouncementModal'
import '../styles/uniAdmin.css'

export default function UniAdminAnnouncementsPage() {
  const sidebarUser = useUniAdminSidebarUser()

  const [modalOpen,  setModalOpen]  = useState(false)
  const [sentCount,  setSentCount]  = useState(0)
  const [sentBanner, setSentBanner] = useState(false)

  const handleSent = () => {
    setSentCount(n => n + 1)
    setSentBanner(true)
    setTimeout(() => setSentBanner(false), 4000)
  }

  return (
    <Layout navItems={UNI_ADMIN_NAV} user={sidebarUser} title="Announcements" subtitle="Send messages to students and lecturers">
      <div className="ua-page">

        {sentBanner && (
          <div style={{ marginBottom: '1rem', padding: '.75rem 1rem', background: '#dcfce7', borderRadius: 8, color: '#16a34a', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <SendHorizonal size={16} /> Announcement sent successfully.
          </div>
        )}

        {/* Compose card */}
        <div className="ua-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Megaphone size={24} color="#7c3aed" />
          </div>
          <h3 style={{ margin: '0 0 .5rem', fontSize: '1rem', fontWeight: 700, color: '#111827' }}>
            Send an Announcement
          </h3>
          <p style={{ margin: '0 0 1.5rem', fontSize: '0.85rem', color: '#6b7280', maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
            Communicate important information to your students or lecturers — course changes, events, deadlines, or general notices.
          </p>
          <button className="ua-btn ua-btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={13} /> New Announcement
          </button>

          {sentCount > 0 && (
            <p style={{ marginTop: '1.5rem', fontSize: '0.78rem', color: '#9ca3af' }}>
              {sentCount} announcement{sentCount === 1 ? '' : 's'} sent this session
            </p>
          )}
        </div>

        <SendAnnouncementModal
          role="UNI_ADMIN"
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSent={handleSent}
        />
      </div>
    </Layout>
  )
}
