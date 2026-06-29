import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

const ROLE_HOME: Record<string, string> = {
  ROLE_SUPER_ADMIN:    '/super-admin',
  ROLE_PLATFORM_ADMIN: '/super-admin',
  ROLE_ADMIN:          '/uni-admin',
  ROLE_UNI_ADMIN:      '/uni-admin',
  ROLE_LECTURER:       '/lecturer',
  ROLE_STUDENT:        '/student',
}

interface Props {
  allowedRoles: string[]
}

export default function RoleProtectedRoute({ allowedRoles }: Props) {
  const { isAuthenticated, role } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={ROLE_HOME[role ?? ''] ?? '/login'} replace />
  }
  return <Outlet />
}
