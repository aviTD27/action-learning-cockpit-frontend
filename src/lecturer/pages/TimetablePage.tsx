import Layout from '../../shared/layout/Layout'
import { LECTURER_NAV } from '../nav'
import SharedTimetablePage from '../../shared/pages/TimetablePage'

export default function LecturerTimetablePage() {
  return (
    <Layout navItems={LECTURER_NAV} title="Timetable" subtitle="Your weekly schedule">
      <SharedTimetablePage canEdit={false} />
    </Layout>
  )
}
