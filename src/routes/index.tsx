import { Navigate, Route, Routes } from 'react-router-dom'
import UniAdminRoutes from './uniAdmin'
import PlatformAdminRoutes from './platformAdmin'
import LecturerRoutes from './lecturer'
import StudentRoutes from './student'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/uni-admin" replace />} />
      {PlatformAdminRoutes()}
      {UniAdminRoutes()}
      {LecturerRoutes()}
      {StudentRoutes()}
    </Routes>
  )
}