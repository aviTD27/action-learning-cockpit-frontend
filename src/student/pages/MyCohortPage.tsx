import { BookOpen, GraduationCap, Presentation, University } from 'lucide-react'
import { useStudentCohort } from '../hooks/useStudentCohort'
import '../styles/student.css'

type StatusConfig = { label: string; color: string; bg: string }

function statusConfig(status: string): StatusConfig {
  switch (status) {
    case 'ONGOING':     return { label: 'Ongoing',     color: '#15803d', bg: '#dcfce7' }
    case 'COMPLETED':   return { label: 'Completed',   color: '#1d4ed8', bg: '#dbeafe' }
    case 'GRADUATED':   return { label: 'Graduated',   color: '#a16207', bg: '#fef9c3' }
    case 'NOT_STARTED': return { label: 'Not Started', color: '#6b7280', bg: '#f3f4f6' }
    case 'ARCHIVED':    return { label: 'Archived',    color: '#9ca3af', bg: '#f3f4f6' }
    default:            return { label: status,        color: '#6b7280', bg: '#f3f4f6' }
  }
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function MyCohortPage() {
  const { cohort, loading, error } = useStudentCohort()

  if (loading) return <p className="sd-table-empty">Loading cohort info…</p>
  if (error)   return <p className="sd-table-empty">{error}</p>
  if (!cohort) return <p className="sd-table-empty">You are not currently assigned to a cohort.</p>

  const { label, color, bg } = statusConfig(cohort.status)

  return (
    <div className="sd-page">

      {/* Cohort info card */}
      <div className="sd-card">
        <div className="sd-card-header">
          <h3 className="sd-card-title"><GraduationCap size={15} /> Cohort Information</h3>
        </div>
        <div style={{ padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

          {/* Cohort name */}
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
              Cohort
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E3A5F' }}>
              {cohort.cohortName}
            </div>
          </div>

          <div style={{ height: '1px', background: '#f3f4f6' }} />

          {/* Programme */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <BookOpen size={15} color="#9ca3af" />
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Programme
              </div>
              <div style={{ fontSize: '0.875rem', color: '#1E3A5F', fontWeight: 600 }}>
                {cohort.programmeName}
                <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 400, marginLeft: '0.5rem' }}>
                  ({cohort.programmeCode})
                </span>
              </div>
            </div>
          </div>

          {/* University */}
          {cohort.universityName && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <University size={15} color="#9ca3af" />
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  University
                </div>
                <div style={{ fontSize: '0.875rem', color: '#374151' }}>{cohort.universityName}</div>
              </div>
            </div>
          )}

          {/* Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Status
            </span>
            <span
              className="sd-badge"
              style={{ backgroundColor: bg, color }}
            >
              {label}
            </span>
          </div>

        </div>
      </div>

      {/* Lecturers card */}
      <div className="sd-card">
        <div className="sd-card-header">
          <h3 className="sd-card-title">
            <Presentation size={15} /> Lecturers
            <span className="sd-card-count">{cohort.lecturerNames.length}</span>
          </h3>
        </div>

        {cohort.lecturerNames.length === 0 ? (
          <p className="sd-table-empty">No lecturers assigned to this programme yet.</p>
        ) : (
          <div style={{ padding: '0.5rem 0' }}>
            {cohort.lecturerNames.map((name, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 1rem',
                  borderBottom: i < cohort.lecturerNames.length - 1 ? '1px solid #f3f4f6' : 'none',
                }}
              >
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: '9999px',
                  background: '#1E3A5F',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {initials(name)}
                </div>
                <span style={{ fontSize: '0.875rem', color: '#1E3A5F', fontWeight: 500 }}>
                  {name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
