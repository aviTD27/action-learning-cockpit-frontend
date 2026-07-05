import { useMemo, useState } from 'react'
import { Bell } from 'lucide-react'
import Layout from '../../shared/layout/Layout'
import { LECTURER_NAV } from '../nav'
import { useLecturerSidebarUser } from '../hooks/useLecturerSidebarUser'
import { useSubmissions } from '../hooks/useSubmissions'
import { useStudents } from '../../uni-admin/hooks/useStudents'
import '../styles/lecturer.css'

export default function NotifyStudentsPage() {
  const sidebarUser = useLecturerSidebarUser()
  const { submissions, notify } = useSubmissions()
  const { students } = useStudents()
  const [notice, setNotice] = useState<string | null>(null)

  const studentCountByProgramme = useMemo(() => {
    const counts = new Map<number, number>()
    for (const s of students) {
      counts.set(s.programmeId, (counts.get(s.programmeId) ?? 0) + 1)
    }
    return counts
  }, [students])

  const [notifyingAll, setNotifyingAll] = useState(false)

  const handleNotify = (id: number, title: string, programmeId: number) => {
    notify(id)
    const count = studentCountByProgramme.get(programmeId) ?? 0
    setNotice(`Notification sent for "${title}" — ${count} student${count === 1 ? '' : 's'} emailed and notified on the platform.`)
  }

  const handleNotifyAll = async () => {
    if (submissions.length === 0) return
    setNotifyingAll(true)
    try {
      await Promise.all(submissions.map(s => notify(s.id)))
      setNotice(`Reminders sent for all ${submissions.length} submission${submissions.length === 1 ? '' : 's'} — students who haven't submitted were emailed and notified.`)
    } finally {
      setNotifyingAll(false)
    }
  }

  return (
    <Layout navItems={LECTURER_NAV} user={sidebarUser} title="Notify Students" subtitle="Send submission reminders to students">
      <div className="ua-page">

        {notice && (
          <div className="ua-card">
            <p className="ua-notice">{notice}</p>
          </div>
        )}

        <div className="ua-card">
          <div className="ua-card-header">
            <p className="ua-card-title"><Bell size={14} /> Notifications<span className="ua-count">{submissions.length} submissions</span></p>
            <button
              className="ua-btn ua-btn-success"
              onClick={handleNotifyAll}
              disabled={notifyingAll || submissions.length === 0}
              title="Send reminders for every submission to students who haven't submitted"
            >
              <Bell size={12} /> {notifyingAll ? 'Notifying…' : 'Notify All'}
            </button>
          </div>
          <div className="ua-table-wrap">
            {submissions.length === 0 ? (
              <p className="ua-table-empty">No submissions yet, create one from the Submissions page.</p>
            ) : (
              <table className="ua-table">
                <thead>
                  <tr>
                    <th>Submission</th>
                    <th>Course</th>
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
                      <td className="col-muted">{s.courseName}</td>
                      <td>{studentCountByProgramme.get(s.programmeId) ?? 0} students</td>
                      <td className="col-muted">{s.dueDate}</td>
                      <td className="col-muted">
                        {s.lastNotifiedAt ? new Date(s.lastNotifiedAt).toLocaleString() : 'Never'}
                      </td>
                      <td className="col-actions">
                        <button
                          className="ua-btn ua-btn-primary"
                          onClick={() => handleNotify(s.id, s.title, s.programmeId)}
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
