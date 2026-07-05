import Layout from '../../shared/layout/Layout'
import { UNI_ADMIN_NAV } from '../nav'
import { useAuth } from '../../auth/AuthContext'
import { useUniAdminSidebarUser } from '../hooks/useUniAdminSidebarUser'
import SharedTimetablePage from '../../shared/pages/TimetablePage'

export default function UniAdminTimetablePage() {
  const { universityId } = useAuth()
  const sidebarUser = useUniAdminSidebarUser()

  return (
    <Layout navItems={UNI_ADMIN_NAV} user={sidebarUser} title="Timetable" subtitle="Weekly schedule management">
      <SharedTimetablePage canEdit universityId={universityId} />
    </Layout>
  )
}
