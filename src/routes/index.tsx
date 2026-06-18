import { Route, Routes } from 'react-router-dom'
import UniAdminRoutes from './uniAdmin'
import PlatformAdminRoutes from './platformAdmin'
import LecturerRoutes from './lecturer'
import StudentRoutes from './student'
import LandingPage from '../landing/LandingPage'
import RequestAccessPage from '../landing/RequestAccessPage'
import LoginPage from '../pages/LoginPage'
import ProtectedRoute from '../auth/ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/request-access" element={<RequestAccessPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Authenticated */}
      <Route element={<ProtectedRoute />}>
        {PlatformAdminRoutes()}
        {UniAdminRoutes()}
        {LecturerRoutes()}
        {StudentRoutes()}
      </Route>
    </Routes>
  )
}
