import { Route } from 'react-router-dom'
import SuperAdminDashboard from '../super-admin/pages/SuperAdminDashboard'
import RegistrationsPage from '../super-admin/pages/RegistrationsPage'
import PlatformAdminsPage from '../super-admin/pages/PlatformAdminsPage'

export default function SuperAdminRoutes() {
  return (
    <>
      <Route path="/super-admin" element={<SuperAdminDashboard />} />
      <Route path="/super-admin/registrations" element={<RegistrationsPage />} />
      <Route path="/super-admin/platform-admins" element={<PlatformAdminsPage />} />
    </>
  )
}
