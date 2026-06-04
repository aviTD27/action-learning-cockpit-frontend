import { Routes } from 'react-router-dom'
import UniAdminRoutes from './uniAdmin'
import PlatformAdminRoutes from './platformAdmin'
import TeacherRoutes from './teacher'
import StudentRoutes from './student'

export default function AppRoutes() {
  return (
    <Routes>
      <PlatformAdminRoutes />
      <UniAdminRoutes />
      <TeacherRoutes />
      <StudentRoutes />
    </Routes>
  )
}