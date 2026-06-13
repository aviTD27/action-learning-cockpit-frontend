import { UserRound } from 'lucide-react'
import Layout from '../../shared/layout/Layout'
import { LECTURER_NAV, LECTURER_USER } from '../nav'
import '../../uni-admin/styles/uniAdmin.css'

export default function LecturerProfilePage() {
  return (
    <Layout navItems={LECTURER_NAV} user={LECTURER_USER} title="Profile" subtitle="Your account">
      <div className="ua-page">
        <div className="ua-card">
          <div className="ua-card-header">
            <p className="ua-card-title"><UserRound size={14} /> Profile</p>
          </div>
          <div className="ua-panel-body">
            <div className="ua-stat-row">
              <span className="ua-stat-label">Name</span>
              <span className="ua-stat-value">{LECTURER_USER.name}</span>
            </div>
            <div className="ua-stat-row">
              <span className="ua-stat-label">Institution</span>
              <span className="ua-stat-value">{LECTURER_USER.institution}</span>
            </div>
            <div className="ua-stat-row">
              <span className="ua-stat-label">Role</span>
              <span className="ua-stat-value">{LECTURER_USER.role}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
