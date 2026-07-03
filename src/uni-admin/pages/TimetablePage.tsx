import Layout from '../../shared/layout/Layout'
import { UNI_ADMIN_NAV } from '../nav'
import { useAuth } from '../../auth/AuthContext'
import SharedTimetablePage from '../../shared/pages/TimetablePage'

export default function UniAdminTimetablePage() {
  const { displayName, universityId } = useAuth()
  const sidebarUser = { name: displayName ?? '', role: 'UNI ADMIN' }

  return (
    <Layout navItems={UNI_ADMIN_NAV} user={sidebarUser} title="Timetable" subtitle="Weekly schedule management">
      <SharedTimetablePage canEdit universityId={universityId} />
    </Layout>
  )
}
