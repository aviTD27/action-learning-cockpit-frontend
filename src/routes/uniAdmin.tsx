import { Route } from 'react-router-dom'
// import Layout from '../shared/layout/Layout'
import UniAdminDashboard from '../uni-admin/pages/UniAdminDashboard'

// function Page({ title }: { title: string }) {
//   return (
//     <Layout>
//       <h1 className="page-title">{title}</h1>
//       <p className="page-subtitle">Page content</p>
//     </Layout>
//   )
// }

export default function UniAdminRoutes() {
  return (
    <>
      <Route path="/uni-admin" element={<UniAdminDashboard />} />
    </>
  )
}