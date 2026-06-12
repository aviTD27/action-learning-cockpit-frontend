import Layout from '../../shared/layout/Layout'
import { UNI_ADMIN_NAV, UNI_ADMIN_USER } from '../nav'
import CohortTable from '../components/tables/CohortTable'
import '../styles/uniAdmin.css'

export default function CohortsPage() {
  return (
    <Layout navItems={UNI_ADMIN_NAV} user={UNI_ADMIN_USER} title="Cohort Management" subtitle="Create, edit and archive cohorts">
      <div className="ua-page">
        <CohortTable />
      </div>
    </Layout>
  )
}
