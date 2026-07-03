import Layout from '../../shared/layout/Layout'
import { LECTURER_NAV } from '../nav'
import { useLecturerSidebarUser } from '../hooks/useLecturerSidebarUser'
import SharedTimetablePage from '../../shared/pages/TimetablePage'

export default function LecturerTimetablePage() {
  const sidebarUser = useLecturerSidebarUser()
  return (
    <Layout navItems={LECTURER_NAV} user={sidebarUser} title="Timetable" subtitle="Your weekly schedule">
      <SharedTimetablePage canEdit={false} />
    </Layout>
  )
}
