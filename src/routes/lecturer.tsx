import { Route } from 'react-router-dom'
import LecturerDashboard from '../lecturer/pages/LecturerDashboard'
import SubmissionsPage from '../lecturer/pages/SubmissionsPage'
import SubmissionDetailPage from '../lecturer/pages/SubmissionDetailPage'
import NotifyStudentsPage from '../lecturer/pages/NotifyStudentsPage'
import GradeReviewPage from '../lecturer/pages/GradeReviewPage'
import LecturerProfilePage from '../lecturer/pages/LecturerProfilePage'
import LecturerTimetablePage from '../lecturer/pages/TimetablePage'

export default function LecturerRoutes() {
  return (
    <>
      <Route path="/lecturer" element={<LecturerDashboard />} />
      <Route path="/lecturer/timetable" element={<LecturerTimetablePage />} />
      <Route path="/lecturer/submissions" element={<SubmissionsPage />} />
      <Route path="/lecturer/submissions/:id" element={<SubmissionDetailPage />} />
      <Route path="/lecturer/notify" element={<NotifyStudentsPage />} />
      <Route path="/lecturer/grade-review" element={<GradeReviewPage />} />
      <Route path="/lecturer/profile" element={<LecturerProfilePage />} />
    </>
  )
}
