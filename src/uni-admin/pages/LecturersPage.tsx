import Layout from '../../shared/layout/Layout'
import { UNI_ADMIN_NAV } from '../nav'
import { useUniAdminSidebarUser } from '../hooks/useUniAdminSidebarUser'
import LecturerTable from '../components/tables/LecturerTable'
import '../styles/uniAdmin.css'

export default function LecturersPage() {
  const sidebarUser = useUniAdminSidebarUser()
  return (
    <Layout navItems={UNI_ADMIN_NAV} user={sidebarUser} title="Lecturers" subtitle="Manage lecturers and programme assignments">
      <div className="ua-page">
        <LecturerTable />
      </div>
    </Layout>
  )
}
