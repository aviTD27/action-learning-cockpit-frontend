import DashboardPage from '../pages/DashboardPage'
import { useAuth } from '../../auth/AuthContext'
import StudentLayout from './StudentLayout'

export default function StudentDashboard() {
  const { displayName } = useAuth()

  return (
    <StudentLayout
      title="Student Dashboard"
      subtitle={displayName ? `Welcome back, ${displayName}` : 'Your learning overview'}
    >
      <DashboardPage />
    </StudentLayout>
  )
}
