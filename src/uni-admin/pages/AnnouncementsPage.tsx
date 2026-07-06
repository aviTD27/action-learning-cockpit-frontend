import { useState } from 'react'
import { Megaphone, Plus, SendHorizonal } from 'lucide-react'
import Layout from '../../shared/layout/Layout'
import { UNI_ADMIN_NAV } from '../nav'
import { useUniAdminSidebarUser } from '../hooks/useUniAdminSidebarUser'
import SendAnnouncementModal from '../../shared/components/SendAnnouncementModal'
import SentAnnouncementsFeed from '../../shared/components/SentAnnouncementsFeed'
import '../styles/uniAdmin.css'

export default function UniAdminAnnouncementsPage() {
  const sidebarUser = useUniAdminSidebarUser()

  const [modalOpen,   setModalOpen]   = useState(false)
  const [sentBanner,  setSentBanner]  = useState(false)
  const [refreshKey,  setRefreshKey]  = useState(0)

  const handleSent = () => {
    setRefreshKey(k => k + 1)
    setSentBanner(true)
    setTimeout(() => setSentBanner(false), 4000)
  }

  return (
    <Layout navItems={UNI_ADMIN_NAV} user={sidebarUser} title="Announcements" subtitle="Send messages to students and lecturers">
      <div className="ua-page" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>

        {sentBanner && (
          <div style={{ flexShrink: 0, padding: '.75rem 1rem', background: '#dcfce7', borderRadius: 8, color: '#16a34a', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <SendHorizonal size={16} /> Announcement sent successfully.
          </div>
        )}

        {/* ── Compose strip ── */}
        <div className="ua-card" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1rem 1.5rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Megaphone size={20} color="#7c3aed" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>Send an Announcement</p>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#6b7280', marginTop: 2 }}>
              Notify students or lecturers about events, deadlines, or changes.
            </p>
          </div>
          <button className="ua-btn ua-btn-primary" style={{ flexShrink: 0 }} onClick={() => setModalOpen(true)}>
            <Plus size={13} /> New Announcement
          </button>
        </div>

        {/* ── Sent history ── */}
        <div className="ua-card" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <SendHorizonal size={14} color="#6b7280" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>Sent Announcements</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <SentAnnouncementsFeed refreshKey={refreshKey} />
          </div>
        </div>

      </div>

      <SendAnnouncementModal
        role="UNI_ADMIN"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSent={handleSent}
      />
    </Layout>
  )
}
