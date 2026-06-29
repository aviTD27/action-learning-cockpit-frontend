import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  approveRegistration, declineRegistration, listRegistrations,
  type RegistrationResponse,
} from '../../api/registrations'
import '../styles/registrations.css'

type Filter = 'PENDING' | 'APPROVED' | 'DECLINED' | 'ALL'
const FILTERS: Filter[] = ['PENDING', 'APPROVED', 'DECLINED', 'ALL']

export default function RegistrationRequestsPage() {
  const [filter, setFilter] = useState<Filter>('PENDING')
  const [rows, setRows] = useState<RegistrationResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)

  const reload = useCallback(() => {
    setLoading(true); setError(null)
    return listRegistrations(filter === 'ALL' ? undefined : filter)
      .then(res => setRows(res.data))
      .catch(() => setError('Could not load registration requests (is the backend running?)'))
      .finally(() => setLoading(false))
  }, [filter])

  useEffect(() => { reload() }, [reload])

  const approve = async (r: RegistrationResponse) => {
    setBusyId(r.id)
    try { await approveRegistration(r.id); await reload() }
    catch { setError(`Could not approve "${r.orgName}".`) }
    finally { setBusyId(null) }
  }

  const decline = async (r: RegistrationResponse) => {
    const reason = window.prompt(`Decline "${r.orgName}"? Optional reason:`, '') 
    if (reason === null) return
    setBusyId(r.id)
    try { await declineRegistration(r.id, reason); await reload() }
    catch { setError(`Could not decline "${r.orgName}".`) }
    finally { setBusyId(null) }
  }

  const badge = (s: string) =>
    <span className={`rq-badge rq-${s.toLowerCase()}`}>{s}</span>

  return (
    <div className="rq-page">
      <div className="rq-head">
        <div>
          <h1>University Registration Requests</h1>
          <p>Review universities requesting access. Approving creates the university record.</p>
        </div>
        <Link to="/platform-admin" className="rq-link">← Dashboard</Link>
      </div>

      <div className="rq-filters">
        {FILTERS.map(f => (
          <button key={f} className={`rq-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {error && <p className="rq-error">{error}</p>}

      <div className="rq-card">
        {loading ? (
          <p className="rq-empty">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="rq-empty">No {filter === 'ALL' ? '' : filter.toLowerCase()} requests.</p>
        ) : (
          <table className="rq-table">
            <thead>
              <tr><th>University</th><th>Domain</th><th>Admin</th><th>Contact email</th><th>Submitted</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td className="rq-name">{r.orgName}<span className="rq-sub">{r.country}</span></td>
                  <td>{r.domain}</td>
                  <td>{r.adminFirstName} {r.adminLastName}</td>
                  <td>{r.adminContactEmail}</td>
                  <td>{r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : '—'}</td>
                  <td>{badge(r.status)}{r.status === 'DECLINED' && r.declineReason ? <span className="rq-sub">{r.declineReason}</span> : null}</td>
                  <td className="rq-actions">
                    {r.status === 'PENDING' ? (
                      <>
                        <button className="rq-btn rq-approve" disabled={busyId === r.id} onClick={() => approve(r)}>Approve</button>
                        <button className="rq-btn rq-decline" disabled={busyId === r.id} onClick={() => decline(r)}>Decline</button>
                      </>
                    ) : <span className="rq-sub">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
