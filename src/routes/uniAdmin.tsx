import { Route } from 'react-router-dom'
import Layout from '../shared/layout/Layout'

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
      <Route path="/university/dashboard" element={<Page title="Overview" />} />
      <Route path="/university/cohorts" element={<Page title="Cohort Management" />} />
      <Route path="/university/lecturers" element={<Page title="Lecturers" />} />
      <Route path="/university/students" element={<Page title="Students" />} />
      <Route path="/university/compliance" element={<Page title="Compliance" />} />
      <Route path="/university/analytics" element={<Page title="Analytics" />} />
      <Route path="/university/settings" element={<Page title="Settings" />} />
    </>
  )
}