import { Navigate, Route, Routes } from 'react-router-dom'
import UniAdminRoutes from './uniAdmin'
import PlatformAdminRoutes from './platformAdmin'
import LecturerRoutes from './lecturer'
import StudentRoutes from './student'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ProtectedRoute from '../auth/ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route element={<ProtectedRoute />}>
        {PlatformAdminRoutes()}
        {UniAdminRoutes()}
        {LecturerRoutes()}
        {StudentRoutes()}
      </Route>
    </Routes>
  )
}