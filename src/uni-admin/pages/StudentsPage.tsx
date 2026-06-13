import Layout from '../../shared/layout/Layout'
import { UNI_ADMIN_NAV, UNI_ADMIN_USER } from '../nav'
import StudentTable from '../components/tables/StudentTable'
import '../styles/uniAdmin.css'

export default function StudentsPage() {
  return (
    <Layout navItems={UNI_ADMIN_NAV} user={UNI_ADMIN_USER} title="Students" subtitle="Enrollment and student management">
      <div className="ua-page">
        <StudentTable />
      </div>
    </Layout>
  )
}
