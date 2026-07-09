import { GraduationCap, Landmark, UserRound, Users } from 'lucide-react'
import { useStudentProfile } from '../hooks/useStudentProfile'
import '../styles/student.css'

function initials(first: string, last: string) {
  return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase()
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE: 'sd-badge sd-badge-submitted',
    SUSPENDED: 'sd-badge sd-badge-past-due',
    GRADUATED: 'sd-badge sd-badge-graded',
    WITHDRAWN: 'sd-badge sd-badge-pending',
    INACTIVE: 'sd-badge sd-badge-pending',
  }
  const cls = map[status.toUpperCase()] ?? 'sd-badge sd-badge-pending'
  return <span className={cls}>{status.charAt(0) + status.slice(1).toLowerCase()}</span>
}

export default function ProfilePage() {
  const { profile, loading, error } = useStudentProfile()

  if (loading) return <p className="sd-table-empty">Loading profile…</p>
  if (error || !profile) return <p className="sd-table-empty">{error ?? 'Profile not found.'}</p>

  return (
    <div className="sd-page">

      <div className="sd-card">
        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '3.5rem', height: '3.5rem', borderRadius: '9999px',
            background: '#1E3A5F', border: '2px solid #F0A500',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: '1.125rem', flexShrink: 0,
          }}>
            {initials(profile.firstName, profile.lastName)}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1E3A5F' }}>
              {profile.firstName} {profile.lastName}
            </p>
            <p style={{ margin: '2px 0 6px', fontSize: '0.8125rem', color: '#6b7280' }}>
              {profile.email}
            </p>
            <StatusBadge status={profile.status} />
          </div>
        </div>
      </div>

      <div className="sd-two-col">

        <div className="sd-card">
          <div className="sd-card-header">
            <p className="sd-card-title"><UserRound size={14} /> Personal Info</p>
          </div>
          <div style={{ padding: '0.25rem 1rem' }}>
            {[
              { label: 'First name', value: profile.firstName },
              { label: 'Last name', value: profile.lastName  },
              { label: 'Email', value: profile.email     },
              { label: 'Student ref', value: profile.studentRef },
              { label: 'Status', value: <StatusBadge status={profile.status} /> },
            ].map(r => (
              <div key={r.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6',
                fontSize: '0.75rem',
              }}>
                <span style={{ color: '#6b7280' }}>{r.label}</span>
                <span style={{ fontWeight: 600, color: '#1E3A5F' }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sd-card">
          <div className="sd-card-header">
            <p className="sd-card-title"><GraduationCap size={14} /> Academic Info</p>
          </div>
          <div style={{ padding: '0.25rem 1rem' }}>
            {[
              { label: 'University', icon: Landmark, value: profile.universityName ?? '' },
              { label: 'Programme',  icon: GraduationCap, value: profile.programmeName          },
              { label: 'Cohort', icon: Users, value: profile.cohortName ?? ''},
            ].map(r => (
              <div key={r.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6',
                fontSize: '0.75rem',
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

    </div>
  )
}
