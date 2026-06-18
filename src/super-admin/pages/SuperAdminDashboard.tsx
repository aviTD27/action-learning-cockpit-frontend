import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Users } from 'lucide-react'
import Layout from '../../shared/layout/Layout'
import { SUPER_ADMIN_NAV } from '../nav'
import { listRegistrations, type RegistrationResponse } from '../../api/registrations'
import { listPlatformAdmins, type PlatformAdmin } from '../../api/platformAdmins'
import '../styles/superAdmin.css'

export default function SuperAdminDashboard() {
  const [regs, setRegs]   = useState<RegistrationResponse[]>([])
  const [admins, setAdmins] = useState<PlatformAdmin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      listRegistrations().catch(() => ({ data: [] as RegistrationResponse[] })),
      listPlatformAdmins().catch(() => ({ data: [] as PlatformAdmin[] })),
    ]).then(([rRes, aRes]) => {
      setRegs(rRes.data)
      setAdmins(aRes.data)
    }).finally(() => setLoading(false))
  }, [])

  const pending  = regs.filter(r => r.status === 'PENDING').length
  const approved = regs.filter(r => r.status === 'APPROVED').length
  const active   = admins.filter(a => a.active).length

  return (
    <Layout navItems={SUPER_ADMIN_NAV} title="Super Admin" subtitle="ACL Platform · Global oversight">
      <div className="sa-page">
        <h1 className="sa-page-title">Platform Overview</h1>
        <p className="sa-page-sub">Manage university registrations and platform administrators.</p>

        <div className="sa-stats">
          <div className={`sa-stat${pending > 0 ? ' sa-stat-pending' : ''}`}>
            <div className="sa-stat-label">Pending registrations</div>
            <div className="sa-stat-value">{loading ? '—' : pending}</div>
            <div className="sa-stat-note">Awaiting your review</div>
          </div>
          <div className="sa-stat">
            <div className="sa-stat-label">Approved universities</div>
            <div className="sa-stat-value">{loading ? '—' : approved}</div>
            <div className="sa-stat-note">Active on the platform</div>
          </div>
          <div className="sa-stat">
            <div className="sa-stat-label">Platform admins</div>
            <div className="sa-stat-value">{loading ? '—' : active}</div>
            <div className="sa-stat-note">Active accounts</div>
          </div>
        </div>

        <div className="sa-actions">
          <Link to="/super-admin/registrations" className="sa-action">
            <ClipboardList size={15} /> Review Registrations{pending > 0 ? ` (${pending})` : ''}
          </Link>
          <Link to="/super-admin/platform-admins" className="sa-action sa-action-secondary">
            <Users size={15} /> Manage Platform Admins
          </Link>
        </div>
      </div>
    </Layout>
  )
}
