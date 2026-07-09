import { useEffect, useState } from 'react'
import { getUniversity } from '../api/uniAdmin'
import { useAuth } from '../../auth/AuthContext'
import type { SidebarUser } from '../../shared/layout/Sidebar'

function formatRole(role?: string | null) {
  if (!role) return 'Uni Admin'
  return role.replace('ROLE_', '').replace(/_/g, ' ').toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase())
}

export function useUniAdminSidebarUser(): SidebarUser {
  const { firstName, surname, email, role, universityId } = useAuth()
  const [institution, setInstitution] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!universityId) return
    getUniversity(universityId)
      .then(u => setInstitution(u.data.name ?? undefined))
      .catch(() => {})
  }, [universityId])

  const name = firstName && surname ? `${firstName} ${surname}` : (email ?? 'Uni Admin')
  return { name, role: formatRole(role), institution }
}
