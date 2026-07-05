import { useEffect, useState } from 'react'
import { getUniversity } from '../../uni-admin/api/uniAdmin'
import { useAuth } from '../../auth/AuthContext'
import type { SidebarUser } from '../../shared/layout/Sidebar'

function formatRole(role?: string | null) {
  if (!role) return 'Lecturer'
  return role.replace('ROLE_', '').replace(/_/g, ' ').toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase())
}

/** Real sidebar user for lecturer pages (name/role from JWT, university name from the API). */
export function useLecturerSidebarUser(): SidebarUser {
  const { firstName, surname, email, role, universityId } = useAuth()
  const [institution, setInstitution] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!universityId) return
    getUniversity(universityId)
      .then(u => setInstitution(u.data.name ?? undefined))
      .catch(() => {})
  }, [universityId])

  const name = firstName && surname ? `${firstName} ${surname}` : (email ?? 'Lecturer')
  return { name, role: formatRole(role), institution }
}
