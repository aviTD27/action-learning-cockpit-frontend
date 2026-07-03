import AnnouncementInbox from '../../shared/components/AnnouncementInbox'
import '../styles/student.css'

export default function StudentAnnouncementsPage() {
  return (
    <div className="sd-page">
      <AnnouncementInbox recipientRole="ROLE_STUDENT" />
    </div>
  )
}
