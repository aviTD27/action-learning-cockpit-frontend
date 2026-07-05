import { useEffect, useState } from 'react'
import { Landmark, ShieldCheck, UserRound } from 'lucide-react'
import Layout from '../../shared/layout/Layout'
import { UNI_ADMIN_NAV } from '../nav'
import { getUniversity } from '../api/uniAdmin'
import { getMe, type UserProfile } from '../../api/authService'
import { useAuth } from '../../auth/AuthContext'
import '../styles/uniAdmin.css'

function initials(first?: string, last?: string) {
  return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase()
}

function formatRole(role?: string | null) {
  if (!role) return '—'
  return role.replace('ROLE_', '').replace(/_/g, ' ').toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase())
}

export default function ProfilePage() {
  const { firstName, surname, email, role } = useAuth()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [institutionName, setInstitutionName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getMe()
      .then(res => {
        setProfile(res.data)
        if (res.data.universityId) {
          getUniversity(res.data.universityId)
            .then(u => setInstitutionName(u.data.name ?? ''))
            .catch(() => {})
        }
      })
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false))
  }, [])

  const p = profile ?? { firstName: firstName ?? '', surname: surname ?? '', email: email ?? '', role: role ?? '' }

  const sidebarUser = {
    name: p.firstName && p.surname ? `${p.firstName} ${p.surname}` : p.email,
    role: formatRole(p.role),
    institution: institutionName || undefined,
  }

  return (
    <Layout navItems={UNI_ADMIN_NAV} user={sidebarUser} title="Profile" subtitle="Your account">
      <div className="ua-page">
        {loading ? (
          <p className="ua-table-empty">Loading profile…</p>
        ) : error ? (
          <p className="ua-table-empty">{error}</p>
        ) : (
          <>
            {/* Profile header */}
            <div className="ua-card">
              <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{
                  width: '3.5rem', height: '3.5rem', borderRadius: '9999px',
                  background: '#1E3A5F', border: '2px solid #F0A500',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: '1.125rem', flexShrink: 0,
                }}>
                  {initials(p.firstName, p.surname)}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1E3A5F' }}>
                    {p.firstName} {p.surname}
                  </p>
                  <p style={{ margin: '2px 0 6px', fontSize: '0.8125rem', color: '#6b7280' }}>
                    {p.email}
                  </p>
                  <span className="ua-badge ua-badge-active">
                    <span className="ua-badge-dot" /> {formatRole(p.role)}
                  </span>
                </div>
              </div>
            </div>

            {/* Info cards */}
            <div className="ua-two-col">
              {/* Personal info */}
              <div className="ua-card">
                <div className="ua-card-header">
                  <p className="ua-card-title"><UserRound size={14} /> Personal Info</p>
                </div>
                <div style={{ padding: '0.25rem 1rem' }}>
                  {[
                    { label: 'First name', value: p.firstName || '—' },
                    { label: 'Last name',  value: p.surname || '—' },
                    { label: 'Email',      value: p.email || '—' },
                    { label: 'Role',       value: formatRole(p.role) },
                  ].map(r => (
                    <div key={r.label} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.75rem',
                    }}>
                      <span style={{ color: '#6b7280' }}>{r.label}</span>
                      <span style={{ fontWeight: 600, color: '#1E3A5F' }}>{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Institution info */}
              <div className="ua-card">
                <div className="ua-card-header">
                  <p className="ua-card-title"><Landmark size={14} /> Institution</p>
                </div>
                <div style={{ padding: '0.25rem 1rem' }}>
                  {[
                    { label: 'University', icon: Landmark,    value: institutionName || '—' },
                    { label: 'Access',     icon: ShieldCheck, value: formatRole(p.role) },
                  ].map(r => (
                    <div key={r.label} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.75rem',
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#6b7280' }}>
                        <r.icon size={12} /> {r.label}
                      </span>
                      <span style={{ fontWeight: 600, color: '#1E3A5F' }}>{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
