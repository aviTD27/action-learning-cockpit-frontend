import { Route } from 'react-router-dom'
import LecturerDashboard from '../lecturer/pages/LecturerDashboard'
import SubmissionsPage from '../lecturer/pages/SubmissionsPage'
import SubmissionDetailPage from '../lecturer/pages/SubmissionDetailPage'
import SubmissionRulesPage from '../lecturer/pages/SubmissionRulesPage'
import NotifyStudentsPage from '../lecturer/pages/NotifyStudentsPage'
import GradeReviewPage from '../lecturer/pages/GradeReviewPage'
import LecturerProfilePage from '../lecturer/pages/LecturerProfilePage'

export default function LecturerRoutes() {
  return (
    <>
      <Route path="/lecturer" element={<LecturerDashboard />} />
      <Route path="/lecturer/submissions" element={<SubmissionsPage />} />
      <Route path="/lecturer/submissions/:id" element={<SubmissionDetailPage />} />
      <Route path="/lecturer/rules" element={<SubmissionRulesPage />} />
      <Route path="/lecturer/notify" element={<NotifyStudentsPage />} />
      <Route path="/lecturer/grade-review" element={<GradeReviewPage />} />
      <Route path="/lecturer/profile" element={<LecturerProfilePage />} />
    </>
  )
}
