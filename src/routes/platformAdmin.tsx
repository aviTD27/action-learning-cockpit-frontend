import { Route } from 'react-router-dom'
// import Layout from '../shared/layout/Layout'
import PlatformAdminDashboard from '../platform-admin/components/PlatformAdminDashboard'

// function Page({ title }: { title: string }) {
//   return (
//     <Layout>
//       <h1 className="page-title">{title}</h1>
//       <p className="page-subtitle">Page content</p>
//     </Layout>
//   )
// }

export default function PlatformAdminRoutes() {
  return (
    <>
      <Route path="/platform-admin" element={<PlatformAdminDashboard />} />
    </>
  )
}