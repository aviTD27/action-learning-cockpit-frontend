import { Route } from 'react-router-dom'
import Layout from '../shared/layout/Layout'
import UniAdminDashboard from '../uni-admin/pages/UniAdminDashboard'

function Page({ title }: { title: string }) {
  return (
    <Layout>
      <h1 className="page-title">{title}</h1>
      <p className="page-subtitle">Page content</p>
    </Layout>
  )
}

export default function UniAdminRoutes() {
  return (
    <>
      <Route path="/uni-admin/dashboard" element={<UniAdminDashboard/>} />
      <Route path="/uni-admin/cohorts" element={<Page title="Cohort Management" />} />
      <Route path="/uni-admin/lecturers" element={<Page title="Lecturers" />} />
      <Route path="/uni-admin/students" element={<Page title="Students" />} />
      <Route path="/uni-admin/compliance" element={<Page title="Compliance" />} />
      <Route path="/uni-admin/analytics" element={<Page title="Analytics" />} />
      <Route path="/uni-admin/settings" element={<Page title="Settings" />} />
    </>
  )
}