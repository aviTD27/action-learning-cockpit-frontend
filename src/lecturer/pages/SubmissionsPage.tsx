import Layout from '../../shared/layout/Layout'
import { LECTURER_NAV, LECTURER_USER } from '../nav'
import SubmissionTable from '../components/SubmissionTable'
import '../styles/lecturer.css'

export default function SubmissionsPage() {
  return (
    <Layout navItems={LECTURER_NAV} user={LECTURER_USER} title="Submissions" subtitle="Create and manage submissions">
      <div className="ua-page">
        <SubmissionTable />
      </div>
    </Layout>
  )
}
