import { Route, Routes } from 'react-router-dom'
import SuperAdminRoutes from './superAdmin'
import PlatformAdminRoutes from './platformAdmin'
import UniAdminRoutes from './uniAdmin'
import LecturerRoutes from './lecturer'
import StudentRoutes from './student'
import LandingPage from '../landing/LandingPage'
import RequestAccessPage from '../landing/RequestAccessPage'
import LoginPage from '../pages/LoginPage'
import ProtectedRoute from '../auth/ProtectedRoute'
import RoleProtectedRoute from '../auth/RoleProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/request-access" element={<RequestAccessPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Super Admin + Platform Admin — same access, same pages */}
      <Route element={<RoleProtectedRoute allowedRoles={['ROLE_SUPER_ADMIN', 'ROLE_PLATFORM_ADMIN']} />}>
        {SuperAdminRoutes()}
      </Route>

      {/* All other authenticated roles — same as before */}
      <Route element={<ProtectedRoute />}>
        {PlatformAdminRoutes()}
        {UniAdminRoutes()}
        {LecturerRoutes()}
        {StudentRoutes()}
      </Route>
    </Routes>
  )
}
