import Layout from '../../shared/layout/Layout'
import { LECTURER_NAV } from '../nav'
import { useLecturerSidebarUser } from '../hooks/useLecturerSidebarUser'
import SubmissionTable from '../components/SubmissionTable'
import '../styles/lecturer.css'

export default function SubmissionsPage() {
  const sidebarUser = useLecturerSidebarUser()
  return (
    <Layout navItems={LECTURER_NAV} user={sidebarUser} title="Submissions" subtitle="Create and manage submissions">
      <div className="ua-page">
        <SubmissionTable />
      </div>
    </Layout>
  )
}
