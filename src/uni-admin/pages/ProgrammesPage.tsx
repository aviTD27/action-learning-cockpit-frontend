import Layout from '../../shared/layout/Layout'
import { UNI_ADMIN_NAV } from '../nav'
import { useUniAdminSidebarUser } from '../hooks/useUniAdminSidebarUser'
import ProgrammeTable from '../components/tables/ProgrammeTable'
import '../styles/uniAdmin.css'

export default function ProgrammesPage() {
  const sidebarUser = useUniAdminSidebarUser()
  return (
    <Layout navItems={UNI_ADMIN_NAV} user={sidebarUser} title="Programmes" subtitle="Manage university programmes">
      <div className="ua-page">
        <ProgrammeTable />
      </div>
    </Layout>
  )
}
