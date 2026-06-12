import { Route } from 'react-router-dom'
import UniAdminOverview from '../uni-admin/pages/UniAdminOverview'
import ProgrammesPage from '../uni-admin/pages/ProgrammesPage'
import CohortsPage from '../uni-admin/pages/CohortsPage'
import LecturersPage from '../uni-admin/pages/LecturersPage'
import StudentsPage from '../uni-admin/pages/StudentsPage'
import CompliancePage from '../uni-admin/pages/CompliancePage'
import AnalyticsPage from '../uni-admin/pages/AnalyticsPage'
import ProfilePage from '../uni-admin/pages/ProfilePage'

export default function UniAdminRoutes() {
  return (
    <>
      <Route path="/uni-admin" element={<UniAdminOverview />} />
      <Route path="/uni-admin/programmes" element={<ProgrammesPage />} />
      <Route path="/uni-admin/cohorts" element={<CohortsPage />} />
      <Route path="/uni-admin/lecturers" element={<LecturersPage />} />
      <Route path="/uni-admin/students" element={<StudentsPage />} />
      <Route path="/uni-admin/compliance" element={<CompliancePage />} />
      <Route path="/uni-admin/analytics" element={<AnalyticsPage />} />
      <Route path="/uni-admin/profile" element={<ProfilePage />} />
    </>
  )
}
