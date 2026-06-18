import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../shared/layout/Layout'
import { SUPER_ADMIN_NAV } from '../nav'
import {
  approveRegistration, declineRegistration, listRegistrations,
  type RegistrationResponse,
} from '../../api/registrations'
import '../styles/superAdmin.css'

type Filter = 'PENDING' | 'APPROVED' | 'DECLINED' | 'ALL'
const FILTERS: Filter[] = ['PENDING', 'APPROVED', 'DECLINED', 'ALL']

export default function RegistrationsPage() {
  const [filter, setFilter]   = useState<Filter>('PENDING')
  const [rows, setRows]       = useState<RegistrationResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [busyId, setBusyId]   = useState<number | null>(null)

  const reload = useCallback(() => {
    setLoading(true); setError(null)
    return listRegistrations(filter === 'ALL' ? undefined : filter)
      .then(res => setRows(res.data))
      .catch(() => setError('Could not load registration requests.'))
      .finally(() => setLoading(false))
  }, [filter])

  useEffect(() => { reload() }, [reload])

  const approve = async (r: RegistrationResponse) => {
    if (!window.confirm(`Approve "${r.orgName}"? This will create the university and its admin account.`)) return
    setBusyId(r.id)
    try { await approveRegistration(r.id); await reload() }
    catch { setError(`Could not approve "${r.orgName}".`) }
    finally { setBusyId(null) }
  }

  const decline = async (r: RegistrationResponse) => {
    const reason = window.prompt(`Decline "${r.orgName}"?\nOptional reason (sent to applicant):`, '')
    if (reason === null) return
    setBusyId(r.id)
    try { await declineRegistration(r.id, reason); await reload() }
    catch { setError(`Could not decline "${r.orgName}".`) }
    finally { setBusyId(null) }
  }

  const badge = (s: string) =>
    <span className={`sa-badge sa-${s.toLowerCase()}`}>{s}</span>

  return (
    <Layout navItems={SUPER_ADMIN_NAV} title="Registrations" subtitle="Review university access requests">
      <div className="sa-page">
        <div className="sa-head">
          <div>
            <h1 className="sa-page-title">University Registration Requests</h1>
            <p className="sa-page-sub">Approving a request creates the university and its Uni Admin account automatically.</p>
          </div>
          <Link to="/super-admin" className="sa-action sa-action-secondary" style={{ textDecoration: 'none' }}>← Dashboard</Link>
        </div>

        <div className="sa-filters">
          {FILTERS.map(f => (
            <button key={f} className={`sa-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {error && <p className="sa-error">{error}</p>}

        <div className="sa-card">
          {loading ? (
            <p className="sa-empty">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="sa-empty">No {filter === 'ALL' ? '' : filter.toLowerCase()} requests.</p>
          ) : (
            <table className="sa-table">
              <thead>
                <tr>
                  <th>University</th>
                  <th>Domain</th>
                  <th>Admin contact</th>
                  <th>Email</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id}>
                    <td>
                      <span className="sa-name">{r.orgName}</span>
                      <span className="sa-sub">{r.country}</span>
                    </td>
                    <td>{r.domain}</td>
                    <td>{r.adminFirstName} {r.adminLastName}</td>
                    <td>{r.adminContactEmail}</td>
                    <td>{r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : '—'}</td>
                    <td>
                      {badge(r.status)}
                      {r.status === 'DECLINED' && r.declineReason
                        ? <span className="sa-sub">{r.declineReason}</span>
                        : null}
                    </td>
                    <td>
                      {r.status === 'PENDING' ? (
                        <>
                          <button className="sa-btn sa-btn-primary" disabled={busyId === r.id} onClick={() => approve(r)}>Approve</button>
                          <button className="sa-btn sa-btn-danger"  disabled={busyId === r.id} onClick={() => decline(r)}>Decline</button>
                        </>
                      ) : <span className="sa-sub">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  )
}
