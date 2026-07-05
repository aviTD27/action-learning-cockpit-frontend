import Layout from '../../shared/layout/Layout'
import { UNI_ADMIN_NAV } from '../nav'
import { useUniAdminSidebarUser } from '../hooks/useUniAdminSidebarUser'
import CohortTable from '../components/tables/CohortTable'
import '../styles/uniAdmin.css'

export default function CohortsPage() {
  const sidebarUser = useUniAdminSidebarUser()
  return (
    <Layout navItems={UNI_ADMIN_NAV} user={sidebarUser} title="Cohort Management" subtitle="Create, edit and archive cohorts">
      <div className="ua-page">
        <CohortTable />
      </div>
    </Layout>
  )
}
