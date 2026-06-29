import Layout from '../../shared/layout/Layout'
import { STUDENT_NAV } from '../nav'
import DashboardPage from '../pages/DashboardPage'
import { useAuth } from '../../auth/AuthContext'

export default function StudentDashboard() {
  const { displayName } = useAuth()

  return (
    <Layout
      navItems={STUDENT_NAV}
      title="Student Dashboard"
      subtitle={displayName ? `Welcome back, ${displayName}` : 'Your learning overview'}
    >
      <DashboardPage />
    </Layout>
  )
}
