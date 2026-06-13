import { AlertTriangle, CalendarClock, FileCheck, RefreshCcw, Scale, ScrollText } from 'lucide-react'
import Layout from '../../shared/layout/Layout'
import { LECTURER_NAV, LECTURER_USER } from '../nav'
import '../styles/lecturer.css'

interface RuleSection {
  icon: typeof ScrollText
  title: string
  body: string
  details?: { label: string; value: string }[]
}

const SECTIONS: RuleSection[] = [
  {
    icon: CalendarClock,
    title: 'Deadlines & Late Work',
    body: `Every submission has a due date visible on the submission page. Work must be
submitted before 23:59 on the due date (Paris time). Whether late work is accepted
depends on the rule set for each submission: when late submissions are not allowed,
the platform closes at the deadline; when they are allowed, work submitted after the
deadline is flagged as late and may receive a penalty at the lecturer's discretion.`,
  },
  {
    icon: FileCheck,
    title: 'File Requirements',
    body: `Each submission specifies its accepted file types — files in any other format
are rejected at upload. Unless the submission says otherwise, the following formats and
limits apply. Name every file with your student reference followed by the submission
name, e.g. STU-2026-001_sprint2.pdf. Archives must contain the work at the top level —
do not nest folders inside folders.`,
    details: [
      { label: '.pdf', value: 'Written reports, documentation, slide exports' },
      { label: '.zip', value: 'Source code and multi-file deliverables (no .rar / .7z)' },
      { label: '.csv / .xlsx', value: 'Data deliverables, only when explicitly requested' },
      { label: '.mp4', value: 'Demo recordings, only when explicitly requested' },
      { label: 'Maximum file size', value: '50 MB per file' },
      { label: 'Not accepted', value: 'Executables (.exe, .bat), links to external drives' },
    ],
  },
  {
    icon: RefreshCcw,
    title: 'Attempts & Resubmission',
    body: `Submissions define a maximum number of attempts. Until the deadline, you may
re-submit up to that limit — only the most recent attempt is graded. Once the deadline
passes or the attempt limit is reached, no further uploads are accepted.`,
  },
  {
    icon: Scale,
    title: 'Grading & Review',
    body: `Each submission is graded out of the maximum points shown on its page. Grades
are first recorded as drafts while the lecturer reviews the whole cohort, then released
together — you will only see your grade once it has been released. Feedback accompanies
every grade. If you believe a released grade contains an error, contact your lecturer
within 7 days of release.`,
  },
  {
    icon: AlertTriangle,
    title: 'Academic Integrity',
    body: `All submitted work must be your own. Sources, libraries and tools (including AI
assistance) must be cited where used. Plagiarism or unauthorized collaboration leads to
a zero grade for the submission and is reported to the university administration, which
may take further disciplinary action under the EPITA academic integrity policy.`,
  },
]

export default function SubmissionRulesPage() {
  return (
    <Layout navItems={LECTURER_NAV} user={LECTURER_USER} title="Submission Rules" subtitle="Rules that apply to all submissions">
      <div className="ua-page">

        <div className="ua-card">
          <div className="ua-card-header">
            <p className="ua-card-title"><ScrollText size={14} /> Submission Rules</p>
          </div>
          <div className="ua-prose">
            <p>
              These rules apply to every submission created on the Action Learning Cockpit.
              Individual submissions may additionally restrict file types, limit attempts or
              disallow late work — those specifics are shown on each submission's page.
            </p>
          </div>
        </div>

        {SECTIONS.map(s => (
          <div className="ua-card" key={s.title}>
            <div className="ua-card-header">
              <p className="ua-card-title"><s.icon size={14} /> {s.title}</p>
            </div>
            <div className="ua-prose">
              <p>{s.body}</p>
            </div>
            {s.details && (
              <div className="ua-panel-body" style={{ paddingTop: 0 }}>
                {s.details.map(d => (
                  <div className="ua-stat-row" key={d.label}>
                    <span className="ua-stat-label">{d.label}</span>
                    <span className="ua-stat-value">{d.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

      </div>
    </Layout>
  )
}
