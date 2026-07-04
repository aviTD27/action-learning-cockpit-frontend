import Layout from '../../shared/layout/Layout'
import { UNI_ADMIN_NAV } from '../nav'
import { useUniAdminSidebarUser } from '../hooks/useUniAdminSidebarUser'
import StudentTable from '../components/tables/StudentTable'
import '../styles/uniAdmin.css'

export default function StudentsPage() {
  const sidebarUser = useUniAdminSidebarUser()
  return (
    <Layout navItems={UNI_ADMIN_NAV} user={sidebarUser} title="Students" subtitle="Enrollment and student management">
      <div className="ua-page">
        <StudentTable />
      </div>
    </Layout>
  )
}
