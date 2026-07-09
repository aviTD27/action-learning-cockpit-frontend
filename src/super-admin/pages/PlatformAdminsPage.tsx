import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../shared/layout/Layout'
import { SUPER_ADMIN_NAV } from '../nav'
import {
  listPlatformAdmins, createPlatformAdmin,
  blockPlatformAdmin, unblockPlatformAdmin, deletePlatformAdmin,
  type PlatformAdmin, type CreatePlatformAdminRequest,
} from '../../api/platformAdmins'
import '../styles/superAdmin.css'

const EMPTY_FORM: CreatePlatformAdminRequest = { firstName: '', surname: '', email: '' }

type Status = 'Active' | 'Blocked'

function statusOf(a: PlatformAdmin): Status {
  return a.blocked ? 'Blocked' : 'Active'
}

export default function PlatformAdminsPage() {
  const [admins, setAdmins] = useState<PlatformAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<CreatePlatformAdminRequest>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<PlatformAdmin | null>(null)

  const reload = useCallback(() => {
    setLoading(true); setError(null)
    return listPlatformAdmins()
      .then(res => setAdmins(res.data))
      .catch(() => setError('Could not load platform admins. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { reload() }, [reload])

  const openModal = () => { setForm(EMPTY_FORM); setFormError(null); setShowModal(true) }

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.firstName.trim() || !form.surname.trim() || !form.email.trim()) {
      setFormError('All fields are required.')
      return
    }
    setSaving(true); setFormError(null)
    try {
      await createPlatformAdmin(form)
      setShowModal(false)
      await reload()
    } catch (err: any) {
      setFormError(err.response?.data?.message ?? 'Could not create account.')
    } finally {
      setSaving(false)
    }
  }

  const handleBlock = async (a: PlatformAdmin) => {
    setBusyId(a.id)
    try {
      await (a.blocked ? unblockPlatformAdmin(a.id) : blockPlatformAdmin(a.id))
      await reload()
    } catch {
      setError(`Could not ${a.blocked ? 'unblock' : 'block'} "${a.firstName} ${a.surname}".`)
    } finally { setBusyId(null) }
  }

  const handleDelete = async (a: PlatformAdmin) => {
    setBusyId(a.id); setConfirmDelete(null)
    try {
      await deletePlatformAdmin(a.id)
      await reload()
    } catch {
      setError(`Could not delete "${a.firstName} ${a.surname}".`)
    } finally { setBusyId(null) }
  }

  const active  = admins.filter(a => !a.blocked).length
  const blocked = admins.filter(a =>  a.blocked).length

  return (
    <Layout navItems={SUPER_ADMIN_NAV} title="Admin Users" subtitle="Manage university and platform administrator accounts">
      <div className="sa-page">

        {/* Header */}
        <div className="sa-head">
          <div>
            <h1 className="sa-page-title">Admin Users</h1>
            <p className="sa-page-sub">
              {loading ? '' : `${active} active · ${blocked} blocked`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '.6rem', alignItems: 'center' }}>
            <button className="sa-btn sa-btn-primary" style={{ padding: '.45rem .9rem', fontSize: '13px' }} onClick={openModal}>
              + Add Platform Admin
            </button>
            <Link to="/super-admin" className="sa-action sa-action-secondary" style={{ textDecoration: 'none' }}>
              ← Dashboard
            </Link>
          </div>
        </div>

        {error && <p className="sa-error">{error}</p>}

        {/* Table */}
        <div className="sa-card">
          {loading ? (
            <p className="sa-empty">Loading…</p>
          ) : admins.length === 0 ? (
            <p className="sa-empty">No admin users found.</p>
          ) : (
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map(a => {
                  const status = statusOf(a)
                  const busy   = busyId === a.id
                  return (
                    <tr key={a.id}>
                      <td className="sa-name">{a.firstName} {a.surname}</td>
                      <td>{a.email}</td>
                      <td>
                        <span className="sa-badge sa-pending" style={{ fontSize: '11px' }}>
                          {a.role === 'ROLE_PLATFORM_ADMIN' ? 'Platform Admin' : 'University Admin'}
                        </span>
                      </td>
                      <td>
                        <span className={`sa-badge ${status === 'Active' ? 'sa-approved' : 'sa-declined'}`}>
                          {status}
                        </span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <button
                          className={`sa-btn ${a.blocked ? 'sa-btn-success' : 'sa-btn-danger'}`}
                          disabled={busy}
                          onClick={() => handleBlock(a)}
                          title={a.blocked ? 'Restore login access' : 'Block login access'}
                        >
                          {a.blocked ? 'Unblock' : 'Block'}
                        </button>
                        <button
                          className="sa-btn sa-btn-danger"
                          style={{ marginLeft: 4, background: '#1f2937', color: '#fff', border: 'none' }}
                          disabled={busy}
                          onClick={() => setConfirmDelete(a)}
                          title="Soft-delete this admin (hidden from UI, preserved in DB)"
                        >
                          Delete
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

      {/* Create modal */}
      {showModal && (
        <div className="sa-overlay" onClick={() => setShowModal(false)}>
          <div className="sa-modal" onClick={e => e.stopPropagation()}>
            <h2 className="sa-modal-title">Add Platform Admin</h2>
            <p style={{ fontSize: 12, color: '#6b7280', marginBottom: '1rem', marginTop: '-0.5rem' }}>
              A welcome email with temporary credentials will be sent automatically.
            </p>
            <form onSubmit={handleCreate} noValidate>
              <div className="sa-field">
                <label className="sa-label">First name</label>
                <input className="sa-input" value={form.firstName}
                  onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} required />
              </div>
              <div className="sa-field">
                <label className="sa-label">Last name</label>
                <input className="sa-input" value={form.surname}
                  onChange={e => setForm(f => ({ ...f, surname: e.target.value }))} required />
              </div>
              <div className="sa-field">
                <label className="sa-label">Email</label>
                <input className="sa-input" type="email" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
              {formError && <p className="sa-error" style={{ marginBottom: 0 }}>{formError}</p>}
              <div className="sa-modal-actions">
                <button type="button" className="sa-modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="sa-modal-submit" disabled={saving}>
                  {saving ? 'Creating…' : 'Create & Send Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Soft-delete confirmation */}
      {confirmDelete && (
        <div className="sa-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="sa-modal" onClick={e => e.stopPropagation()}>
            <h2 className="sa-modal-title">Delete Platform Admin?</h2>
            <p style={{ fontSize: 13, color: '#374151', marginBottom: '1.25rem' }}>
              <strong>{confirmDelete.firstName} {confirmDelete.surname}</strong> will be hidden from this dashboard.
              Their account is <strong>not permanently deleted</strong>  it stays in the database
              and can be restored by a developer if needed.
            </p>
            <div className="sa-modal-actions">
              <button className="sa-modal-cancel" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button
                className="sa-modal-submit"
                style={{ background: '#b91c1c' }}
                onClick={() => handleDelete(confirmDelete)}
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
