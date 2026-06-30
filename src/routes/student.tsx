import { Route } from 'react-router-dom'
import StudentDashboard from '../student/components/StudentDashboard'
import StudentLayout from '../student/components/StudentLayout'
import PlaceholderPage from '../student/pages/PlaceholderPage'
import ProfilePage from '../student/pages/ProfilePage'
import AssignmentsPage from '../student/pages/AssignmentsPage'
import GradesPage from '../student/pages/GradesPage'
import NotificationsPage from '../student/pages/NotificationsPage'

export default function StudentRoutes() {
  return (
    <>
      <Route path="/student" element={<StudentDashboard />} />

      <Route path="/student/assignments" element={
        <StudentLayout title="Assignments" subtitle="Your coursework">
          <AssignmentsPage />
        </StudentLayout>
      } />

      <Route path="/student/grades" element={
        <StudentLayout title="Grades" subtitle="Released grades and feedback">
          <GradesPage />
        </StudentLayout>
      } />

      <Route path="/student/notifications" element={
        <StudentLayout title="Notifications" subtitle="Your in-app notifications">
          <NotificationsPage />
        </StudentLayout>
      } />

      <Route path="/student/cohort" element={
        <StudentLayout title="My Cohort" subtitle="Action Learning Cockpit">
          <PlaceholderPage title="My Cohort" subtitle="Your cohort and lecturer info will appear here." />
        </StudentLayout>
      } />

      <Route path="/student/profile" element={
        <StudentLayout title="Profile" subtitle="Your account">
          <ProfilePage />
        </StudentLayout>
      } />
    </>
  )
}
