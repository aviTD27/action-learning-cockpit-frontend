import { useEffect, useMemo, useState } from 'react'
import { Award, BarChart2, BookOpen, ChevronDown, ChevronRight, TrendingDown, TrendingUp } from 'lucide-react'
import type { GradeItem } from '../api/studentApi'
import {
  getMyGrades,
  getMyProfile,
  getAssignmentsForProgramme,
  markGradeNotificationsRead,
} from '../api/studentApi'
import '../styles/student.css'
import '../styles/grades.css'

function scorePct(grade: number, maxPoints: number): number {
  return maxPoints > 0 ? Math.round((grade / maxPoints) * 100) : 0
}

function scoreColor(pct: number): string {
  if (pct >= 70) return '#16a34a'
  if (pct >= 50) return '#ea580c'
  return '#dc2626'
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

/* ── Overall KPI bar ── */
function SummaryBar({ grades }: { grades: GradeItem[] }) {
  const pcts    = grades.map(g => scorePct(g.grade, g.maxPoints))
  const avg     = Math.round(pcts.reduce((s, p) => s + p, 0) / pcts.length)
  const highest = Math.max(...pcts)
  const lowest  = Math.min(...pcts)

  return (
    <div className="sd-kpi-row">
      <div className="sd-kpi-card">
        <Award size={20} className={`sd-kpi-icon ${avg >= 70 ? 'green' : avg >= 50 ? 'orange' : ''}`} />
        <span className={`sd-kpi-value ${avg >= 70 ? 'green' : avg >= 50 ? 'orange' : ''}`}
              style={avg < 50 ? { color: '#dc2626' } : undefined}>
          {avg}%
        </span>
        <span className="sd-kpi-label">Overall Average</span>
      </div>
      <div className="sd-kpi-card">
        <TrendingUp size={20} className="sd-kpi-icon green" />
        <span className="sd-kpi-value green">{highest}%</span>
        <span className="sd-kpi-label">Highest Score</span>
      </div>
      <div className="sd-kpi-card">
        <TrendingDown size={20} className={`sd-kpi-icon ${lowest >= 50 ? 'orange' : ''}`}
                      style={lowest < 50 ? { color: '#dc2626' } : undefined} />
        <span className={`sd-kpi-value ${lowest >= 70 ? 'green' : lowest >= 50 ? 'orange' : ''}`}
              style={lowest < 50 ? { color: '#dc2626' } : undefined}>
          {lowest}%
        </span>
        <span className="sd-kpi-label">Lowest Score</span>
      </div>
      <div className="sd-kpi-card">
        <BarChart2 size={20} className="sd-kpi-icon blue" />
        <span className="sd-kpi-value blue">{grades.length}</span>
        <span className="sd-kpi-label">Graded Assignments</span>
      </div>
    </div>
  )
}

/* ── Expandable grade row ── */
function GradeRow({ grade }: { grade: GradeItem }) {
  const [open, setOpen] = useState(false)
  const p     = scorePct(grade.grade, grade.maxPoints)
  const color = scoreColor(p)

  return (
    <div className="grades-row">
      <div className="grades-row-main" onClick={() => setOpen(o => !o)}>
        <div>
          <div className="grades-row-title">{grade.submissionTitle}</div>
          <div className="grades-score-bar-wrap">
            <div className="grades-score-bar-fill" style={{ width: `${p}%`, backgroundColor: color }} />
          </div>
        </div>
        <span className="grades-row-score" style={{ color }}>
          {grade.grade % 1 === 0 ? grade.grade : grade.grade.toFixed(1)} / {grade.maxPoints}
        </span>
        <span className="grades-row-pct" style={{ color }}>{p}%</span>
        <span className="grades-row-date">
          {formatDate(grade.releasedAt ?? grade.gradedAt)}
          {grade.revised && <span className="grades-revised-badge">Revised</span>}
        </span>
        <span className="grades-row-expand">
          {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </span>
      </div>
      {open && (
        <div className="grades-feedback-panel">
          <div className="grades-feedback-meta">
            <span>Released: {formatDate(grade.releasedAt ?? grade.gradedAt)}</span>
            {grade.releasedAt && grade.gradedAt !== grade.releasedAt && (
              <span>Graded: {formatDate(grade.gradedAt)}</span>
            )}
          </div>
          <div className="grades-feedback-label">Feedback</div>
          {grade.feedback
            ? <p className="grades-feedback-text">{grade.feedback}</p>
            : <p className="grades-no-feedback">No feedback provided.</p>
          }
        </div>
      )}
    </div>
  )
}

/* ── Course section (collapsible) ── */
interface CourseGroup {
  courseName: string
  grades: GradeItem[]
}

function CourseSection({ group }: { group: CourseGroup }) {
  const [open, setOpen] = useState(true)
  const pcts  = group.grades.map(g => scorePct(g.grade, g.maxPoints))
  const avg   = Math.round(pcts.reduce((s, p) => s + p, 0) / pcts.length)
  const color = scoreColor(avg)

  return (
    <div className="grades-course-section">
      <div className="grades-course-header" onClick={() => setOpen(o => !o)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
          <BookOpen size={14} style={{ color: '#6366f1', flexShrink: 0 }} />
          <span className="grades-course-name">{group.courseName}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <span className="grades-course-count">
            {group.grades.length} assignment{group.grades.length !== 1 ? 's' : ''}
          </span>
          <span className="grades-course-avg" style={{ color, borderColor: color, background: `${color}14` }}>
            avg {avg}%
          </span>
          <span className="grades-row-expand">
            {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </span>
        </div>
      </div>
      {open && (
        <div className="grades-course-body">
          {group.grades.map(g => <GradeRow key={g.submissionId} grade={g} />)}
        </div>
      )}
    </div>
  )
}

/* ── Main page ── */
export default function GradesPage() {
  const [grades,  setGrades]  = useState<GradeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        // Fetch grades and student profile in parallel
        const [rawGrades, profile] = await Promise.all([
          getMyGrades(),
          getMyProfile(),
        ])

        // Fetch assignments for this student's programme to get course names
        const assignments = await getAssignmentsForProgramme(profile.programmeId)

        // Build explicit lookup: submissionId → courseName
        const courseBySubmission = new Map(
          assignments
            .filter(a => a.courseName)
            .map(a => [a.id, a.courseName as string])
        )

        // Enrich each grade with the course name from the assignments lookup
        const enriched = rawGrades.map(g => ({
          ...g,
          courseName: g.courseName ?? courseBySubmission.get(g.submissionId) ?? null,
        }))

        setGrades(enriched)
        markGradeNotificationsRead().catch(() => {})
      } catch {
        setError('Failed to load grades.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Group grades by course name
  const courseGroups = useMemo<CourseGroup[]>(() => {
    const map = new Map<string, GradeItem[]>()
    for (const g of grades) {
      const key = g.courseName ?? '—'
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(g)
    }
    return Array.from(map.entries()).map(([courseName, grds]) => ({ courseName, grades: grds }))
  }, [grades])

  if (loading) return <p className="sd-table-empty">Loading grades…</p>
  if (error)   return <p className="sd-table-empty">{error}</p>

  if (grades.length === 0) {
    return (
      <div className="sd-page">
        <div className="sd-card">
          <div className="grades-empty">
            <Award size={32} />
            <span>No grades released yet.</span>
            <span style={{ fontSize: '0.8125rem' }}>Your grades will appear here once your lecturer releases them.</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="sd-page">
      <SummaryBar grades={grades} />

      <div className="sd-card">
        <div className="sd-card-header">
          <h3 className="sd-card-title">
            <Award size={15} /> Grades by Course
            <span className="sd-card-count">
              {courseGroups.length} course{courseGroups.length !== 1 ? 's' : ''} · {grades.length} graded
            </span>
          </h3>
        </div>
        {courseGroups.map(group => (
          <CourseSection key={group.courseName} group={group} />
        ))}
      </div>
    </div>
  )
}
