import Layout from '../../shared/layout/Layout'
import { STUDENT_NAV } from '../nav'

export default function StudentDashboard() {
  return (
    <Layout navItems={STUDENT_NAV} title="Student Dashboard" subtitle="Your learning overview">
      <p className="page-title">Student Dashboard</p>
    </Layout>
  )
}