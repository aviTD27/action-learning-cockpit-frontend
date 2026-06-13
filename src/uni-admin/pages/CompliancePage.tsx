import Layout from '../../shared/layout/Layout'
import { UNI_ADMIN_NAV, UNI_ADMIN_USER } from '../nav'
import ComplianceStats from '../components/cards/ComplianceStats'
import '../styles/uniAdmin.css'

export default function CompliancePage() {
  return (
    <Layout navItems={UNI_ADMIN_NAV} user={UNI_ADMIN_USER} title="Compliance" subtitle="Compliance status and alerts">
      <div className="ua-page">
        <ComplianceStats />
      </div>
    </Layout>
  )
}
