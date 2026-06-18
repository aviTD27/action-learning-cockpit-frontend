import { Route } from 'react-router-dom'
import PlatformAdminDashboard from '../platform-admin/components/PlatformAdminDashboard'
import RegistrationRequestsPage from '../platform-admin/pages/RegistrationRequestsPage'

export default function PlatformAdminRoutes() {
  return (
    <>
      <Route path="/platform-admin" element={<PlatformAdminDashboard />} />
      <Route path="/platform-admin/registrations" element={<RegistrationRequestsPage />} />
    </>
  )
}
