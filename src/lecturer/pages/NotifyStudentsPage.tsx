import { useMemo, useState } from 'react'
import { Bell } from 'lucide-react'
import Layout from '../../shared/layout/Layout'
import { LECTURER_NAV, LECTURER_USER } from '../nav'
import { useSubmissions } from '../hooks/useSubmissions'
import { useStudents } from '../../uni-admin/hooks/useStudents'
import '../styles/lecturer.css'

export default function NotifyStudentsPage() {
  const { submissions, notify } = useSubmissions()
  const { students } = useStudents()
  const [notice, setNotice] = useState<string | null>(null)

  const studentCountByCohort = useMemo(() => {
    const counts = new Map<number, number>()
    for (const s of students) {
      counts.set(s.cohortId, (counts.get(s.cohortId) ?? 0) + 1)
    }
    return counts
  }, [students])

  // TODO (backend): Notif 
  const handleNotify = (id: number, title: string, cohortId: number) => {
    notify(id)
    const count = studentCountByCohort.get(cohortId) ?? 0
    setNotice(`Notification for "${title}" queued for ${count} student${count === 1 ? '' : 's'} — emails will be sent once the backend notification service exists.`)
  }

  return (
    <Layout navItems={LECTURER_NAV} user={LECTURER_USER} title="Notify Students" subtitle="Send submission reminders to cohorts">
      <div className="ua-page">

        {notice && (
          <div className="ua-card">
            <p className="ua-notice">{notice}</p>
          </div>
        )}

        <div className="ua-card">
          <div className="ua-card-header">
            <p className="ua-card-title"><Bell size={14} /> Notifications<span className="ua-count">{submissions.length} submissions</span></p>
          </div>
          <div className="ua-table-wrap">
            {submissions.length === 0 ? (
              <p className="ua-table-empty">No submissions yet, create one from the Submissions page.</p>
            ) : (
              <table className="ua-table">
                <thead>
                  <tr>
                    <th>Submission</th>
                    <th>Cohort</th>
                    <th>Recipients</th>
                    <th>Due Date</th>
                    <th>Last Notified</th>
                    <th className="col-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(s => (
                    <tr key={s.id}>
                      <td className="col-name">{s.title}</td>
                      <td className="col-muted">{s.cohortName}</td>
                      <td>{studentCountByCohort.get(s.cohortId) ?? 0} students</td>
                      <td className="col-muted">{s.dueDate}</td>
                      <td className="col-muted">
                        {s.lastNotifiedAt ? new Date(s.lastNotifiedAt).toLocaleString() : 'Never'}
                      </td>
                      <td className="col-actions">
                        <button
                          className="ua-btn ua-btn-primary"
                          onClick={() => handleNotify(s.id, s.title, s.cohortId)}
                        >
                          <Bell size={12} /> Notify
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </Layout>
  )
}
