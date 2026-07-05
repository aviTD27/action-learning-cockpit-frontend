import { useEffect, useState } from 'react'
import { Award, BarChart2, ChevronDown, ChevronRight, TrendingDown, TrendingUp } from 'lucide-react'
import { useStudentGrades } from '../hooks/useStudentGrades'
import type { GradeItem } from '../api/studentApi'
import { markGradeNotificationsRead } from '../api/studentApi'
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

function abbrev(title: string, max = 13): string {
  return title.length > max ? title.slice(0, max - 1) + '…' : title
}

/* ── Summary KPI bar ── */
function SummaryBar({ grades }: { grades: GradeItem[] }) {
  const pcts     = grades.map(g => scorePct(g.grade, g.maxPoints))
  const avg      = Math.round(pcts.reduce((s, p) => s + p, 0) / pcts.length)
  const highest  = Math.max(...pcts)
  const lowest   = Math.min(...pcts)

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

/* ── Bar chart ── */
function BarChart({ grades }: { grades: GradeItem[] }) {
  return (
    <div className="sd-card">
      <div className="sd-card-header">
        <h3 className="sd-card-title"><BarChart2 size={15} /> Score per Assignment</h3>
      </div>
      <div className="grades-chart-area">
        <div className="grades-chart-bars">
          {grades.map(g => {
            const p = scorePct(g.grade, g.maxPoints)
            return (
              <div key={g.submissionId} className="grades-chart-col">
                <div
                  className="grades-chart-bar"
                  style={{ height: `${Math.max(p, 2)}%`, backgroundColor: scoreColor(p) }}
                  title={`${g.submissionTitle}: ${g.grade}/${g.maxPoints} (${p}%)`}
                >
                  <span className="grades-chart-bar-label">{p}%</span>
                </div>
              </div>
            )
          })}
        </div>
        <div className="grades-chart-labels">
          {grades.map(g => (
            <span key={g.submissionId} className="grades-chart-col-label" title={g.submissionTitle}>
              {abbrev(g.submissionTitle)}
            </span>
          ))}
        </div>
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

/* ── Main page ── */
export default function GradesPage() {
  const { grades, loading, error } = useStudentGrades()

  useEffect(() => {
    markGradeNotificationsRead().catch(() => {})
  }, [])

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
      <BarChart grades={grades} />

      <div className="sd-card">
        <div className="sd-card-header">
          <h3 className="sd-card-title">
            <Award size={15} /> All Grades
            <span className="sd-card-count">{grades.length} released</span>
          </h3>
        </div>
        {grades.map(g => <GradeRow key={g.submissionId} grade={g} />)}
      </div>
    </div>
  )
}
