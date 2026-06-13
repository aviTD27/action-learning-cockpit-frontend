import Layout from '../../shared/layout/Layout'
import { UNI_ADMIN_NAV, UNI_ADMIN_USER } from '../nav'
import LecturerTable from '../components/tables/LecturerTable'
import '../styles/uniAdmin.css'

export default function LecturersPage() {
  return (
    <Layout navItems={UNI_ADMIN_NAV} user={UNI_ADMIN_USER} title="Lecturers" subtitle="Manage lecturers and programme assignments">
      <div className="ua-page">
        <LecturerTable />
      </div>
    </Layout>
  )
}
