import Layout from '../../shared/layout/Layout'
import { UNI_ADMIN_NAV, UNI_ADMIN_USER } from '../nav'
import ProgrammeTable from '../components/tables/ProgrammeTable'
import '../styles/uniAdmin.css'

export default function ProgrammesPage() {
  return (
    <Layout navItems={UNI_ADMIN_NAV} user={UNI_ADMIN_USER} title="Programmes" subtitle="Manage university programmes">
      <div className="ua-page">
        <ProgrammeTable />
      </div>
    </Layout>
  )
}
