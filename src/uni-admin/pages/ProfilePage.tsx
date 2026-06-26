import { useEffect, useState } from 'react'
import Layout from '../../shared/layout/Layout'
import { UNI_ADMIN_NAV } from '../nav'
import { getUniversity } from '../api/uniAdmin'
import { useAuth } from '../../auth/AuthContext'
import { UserRound } from 'lucide-react'
import '../styles/uniAdmin.css'

function formatRole(role: string | null) {
  if (!role) return '—'
  return role.replace('ROLE_', '').replace(/_/g, ' ')
}

export default function ProfilePage() {
  const { firstName, surname, email, role, universityId } = useAuth()
  const [institutionName, setInstitutionName] = useState<string>('')

  useEffect(() => {
    if (!universityId) return
    getUniversity(universityId)
      .then(res => setInstitutionName(res.data.name ?? ''))
      .catch(() => {})
  }, [universityId])

  const sidebarUser = {
    name: firstName && surname ? `${firstName} ${surname}` : email ?? '',
    role: formatRole(role),
    institution: institutionName || undefined,
  }

  return (
    <Layout navItems={UNI_ADMIN_NAV} user={sidebarUser} title="Profile" subtitle="Your account">
      <div className="ua-page">
        <div className="ua-card">
          <div className="ua-card-header">
            <p className="ua-card-title"><UserRound size={14} /> Profile</p>
          </div>
          <div className="ua-panel-body">
            <div className="ua-stat-row">
              <span className="ua-stat-label">First Name</span>
              <span className="ua-stat-value">{firstName ?? '—'}</span>
            </div>
            <div className="ua-stat-row">
              <span className="ua-stat-label">Last Name</span>
              <span className="ua-stat-value">{surname ?? '—'}</span>
            </div>
            <div className="ua-stat-row">
              <span className="ua-stat-label">Email</span>
              <span className="ua-stat-value">{email ?? '—'}</span>
            </div>
            <div className="ua-stat-row">
              <span className="ua-stat-label">Role</span>
              <span className="ua-stat-value">{formatRole(role)}</span>
            </div>
            <div className="ua-stat-row">
              <span className="ua-stat-label">Institution</span>
              <span className="ua-stat-value">{institutionName || '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
