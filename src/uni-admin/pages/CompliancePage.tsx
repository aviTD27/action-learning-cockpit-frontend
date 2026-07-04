import Layout from '../../shared/layout/Layout'
import { UNI_ADMIN_NAV } from '../nav'
import { useUniAdminSidebarUser } from '../hooks/useUniAdminSidebarUser'
import ComplianceStats from '../components/cards/ComplianceStats'
import '../styles/uniAdmin.css'

export default function CompliancePage() {
  const sidebarUser = useUniAdminSidebarUser()
  return (
    <Layout navItems={UNI_ADMIN_NAV} user={sidebarUser} title="Compliance" subtitle="Compliance status and alerts">
      <div className="ua-page">
        <ComplianceStats />
      </div>
    </Layout>
  )
}
