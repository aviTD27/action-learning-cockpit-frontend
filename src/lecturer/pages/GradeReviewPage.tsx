import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCheck, Eye } from 'lucide-react'
import Layout from '../../shared/layout/Layout'
import { LECTURER_NAV } from '../nav'
import { useLecturerSidebarUser } from '../hooks/useLecturerSidebarUser'
import { useSubmissions } from '../hooks/useSubmissions'
import { useGradeOverview } from '../hooks/useGradeOverview'
import '../styles/lecturer.css'

export default function GradeReviewPage() {
  const sidebarUser = useLecturerSidebarUser()
  const { submissions } = useSubmissions()
  const { releaseSubmission, summaryFor } = useGradeOverview()
  const [notice, setNotice] = useState<string | null>(null)

  const handleRelease = (id: number, title: string, draft: number) => {
    releaseSubmission(id)
    setNotice(`${draft} draft grade${draft === 1 ? '' : 's'} for "${title}" released — students will see them once the student portal exists.`)
  }

  const totalDraft = submissions.reduce((sum, s) => sum + summaryFor(s.id).draft, 0)

  return (
    <Layout navItems={LECTURER_NAV} user={sidebarUser} title="Grade Review" subtitle="Review draft grades and release them to students">
      <div className="ua-page">

        {notice && (
          <div className="ua-card">
            <p className="ua-notice">{notice}</p>
          </div>
        )}

        <div className="ua-card">
          <div className="ua-card-header">
            <p className="ua-card-title"><CheckCheck size={14} /> Grade Review<span className="ua-count">{totalDraft} draft grade{totalDraft === 1 ? '' : 's'} pending release</span></p>
          </div>
          <div className="ua-table-wrap">
            {submissions.length === 0 ? (
              <p className="ua-table-empty">No submissions yet — create one from the Submissions page.</p>
            ) : (
              <table className="ua-table">
                <thead>
                  <tr>
                    <th>Submission</th>
                    <th>Course</th>
                    <th>Graded</th>
                    <th>Draft</th>
                    <th>Released</th>
                    <th className="col-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(s => {
                    const summary = summaryFor(s.id)
                    return (
                      <tr key={s.id}>
                        <td className="col-name">{s.title}</td>
                        <td className="col-muted">{s.courseName}</td>
                        <td>{summary.graded}</td>
                        <td className={summary.draft > 0 ? 'col-highlight' : 'col-muted'}>{summary.draft}</td>
                        <td className="col-muted">{summary.released}</td>
                        <td className="col-actions">
                          <Link to={`/lecturer/submissions/${s.id}`} className="ua-icon-btn" title="Open grading">
                            <Eye size={13} />
                          </Link>
                          <button
                            className="ua-btn ua-btn-success"
                            disabled={summary.draft === 0}
                            onClick={() => handleRelease(s.id, s.title, summary.draft)}
                          >
                            <CheckCheck size={12} /> Release
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </Layout>
  )
}
