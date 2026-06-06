import { Route } from 'react-router-dom'
// import Layout from '../shared/layout/Layout'
import TeacherDashboard from '../teacher/pages/TeacherDashboard'

// function Page({ title }: { title: string }) {
//   return (
//     <Layout>
//       <h1 className="page-title">{title}</h1>
//       <p className="page-subtitle">Page content goes here.</p>
//     </Layout>
//   )
// }

export default function TeacherRoutes() {
  return (
    <>
      <Route path="/teacher" element={<TeacherDashboard />} />
    </>
  )
}