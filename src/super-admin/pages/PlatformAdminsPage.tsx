import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../shared/layout/Layout'
import { SUPER_ADMIN_NAV } from '../nav'
import {
  listPlatformAdmins, createPlatformAdmin,
  deactivatePlatformAdmin, reactivatePlatformAdmin,
  type PlatformAdmin, type CreatePlatformAdminRequest,
} from '../../api/platformAdmins'
import '../styles/superAdmin.css'

const EMPTY_FORM: CreatePlatformAdminRequest = { firstName: '', surname: '', email: '' }

export default function PlatformAdminsPage() {
  const [admins, setAdmins]     = useState<PlatformAdmin[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [busyId, setBusyId]     = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]         = useState<CreatePlatformAdminRequest>(EMPTY_FORM)
  const [saving, setSaving]     = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const reload = useCallback(() => {
    setLoading(true); setError(null)
    return listPlatformAdmins()
      .then(res => setAdmins(res.data))
      .catch(() => setError('Could not load platform admins.'))
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

  const toggleActive = async (a: PlatformAdmin) => {
    setBusyId(a.id)
    try {
      if (a.active) {
        await deactivatePlatformAdmin(a.id)
      } else {
        await reactivatePlatformAdmin(a.id)
      }
      await reload()
    } catch {
      setError(`Could not ${a.active ? 'deactivate' : 'reactivate'} "${a.firstName} ${a.surname}".`)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <Layout navItems={SUPER_ADMIN_NAV} title="Platform Admins" subtitle="Manage platform administrator accounts">
      <div className="sa-page">
        <div className="sa-head">
          <div>
            <h1 className="sa-page-title">Platform Administrators</h1>
            <p className="sa-page-sub">At least one active Platform Admin must remain at all times.</p>
          </div>
          <div style={{ display: 'flex', gap: '.6rem', alignItems: 'center' }}>
            <button className="sa-btn sa-btn-primary" style={{ padding: '.45rem .9rem', fontSize: '13px' }} onClick={openModal}>
              + Add Platform Admin
            </button>
            <Link to="/super-admin" className="sa-action sa-action-secondary" style={{ textDecoration: 'none' }}>← Dashboard</Link>
          </div>
        </div>

        {error && <p className="sa-error">{error}</p>}

        <div className="sa-card">
          {loading ? (
            <p className="sa-empty">Loading…</p>
          ) : admins.length === 0 ? (
            <p className="sa-empty">No platform admins yet. Add one above.</p>
          ) : (
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map(a => (
                  <tr key={a.id}>
                    <td className="sa-name">{a.firstName} {a.surname}</td>
                    <td>{a.email}</td>
                    <td>
                      <span className={`sa-badge ${a.active ? 'sa-active' : 'sa-inactive'}`}>
                        {a.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '—'}</td>
                    <td>
                      <button
                        className={`sa-btn ${a.active ? 'sa-btn-danger' : 'sa-btn-success'}`}
                        disabled={busyId === a.id}
                        onClick={() => toggleActive(a)}
                      >
                        {a.active ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="sa-overlay" onClick={() => setShowModal(false)}>
          <div className="sa-modal" onClick={e => e.stopPropagation()}>
            <h2 className="sa-modal-title">Add Platform Admin</h2>
            <form onSubmit={handleCreate} noValidate>
              <div className="sa-field">
                <label className="sa-label">First name</label>
                <input className="sa-input" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} required />
              </div>
              <div className="sa-field">
                <label className="sa-label">Last name</label>
                <input className="sa-input" value={form.surname} onChange={e => setForm(f => ({ ...f, surname: e.target.value }))} required />
              </div>
              <div className="sa-field">
                <label className="sa-label">Email</label>
                <input className="sa-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
              {formError && <p className="sa-error" style={{ marginBottom: '0' }}>{formError}</p>}
              <div className="sa-modal-actions">
                <button type="button" className="sa-modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="sa-modal-submit" disabled={saving}>{saving ? 'Creating…' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}
