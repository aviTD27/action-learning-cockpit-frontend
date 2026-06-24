import { Route } from 'react-router-dom'
import Layout from '../shared/layout/Layout'
import { STUDENT_NAV } from '../student/nav'
import StudentDashboard from '../student/components/StudentDashboard'
import PlaceholderPage from '../student/pages/PlaceholderPage'
import ProfilePage from '../student/pages/ProfilePage'
import AssignmentsPage from '../student/pages/AssignmentsPage'

function StudentPage({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Layout navItems={STUDENT_NAV} title={title} subtitle="Action Learning Cockpit">
      <PlaceholderPage title={title} subtitle={subtitle} />
    </Layout>
  )
}

export default function StudentRoutes() {
  return (
    <>
      <Route path="/student"                element={<StudentDashboard />} />
      <Route path="/student/assignments"    element={
        <Layout navItems={STUDENT_NAV} title="Assignments" subtitle="Your coursework">
          <AssignmentsPage />
        </Layout>
      } />
      <Route path="/student/grades"         element={<StudentPage title="Grades"        subtitle="Released grades and feedback will appear here." />} />
      <Route path="/student/notifications"  element={<StudentPage title="Notifications" subtitle="Your notifications will appear here." />} />
      <Route path="/student/cohort"         element={<StudentPage title="My Cohort"     subtitle="Your cohort and lecturer info will appear here." />} />
      <Route path="/student/profile"        element={
        <Layout navItems={STUDENT_NAV} title="Profile" subtitle="Your account">
          <ProfilePage />
        </Layout>
      } />
    </>
  )
}
