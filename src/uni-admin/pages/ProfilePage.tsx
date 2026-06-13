import Layout from '../../shared/layout/Layout'
import { UNI_ADMIN_NAV, UNI_ADMIN_USER } from '../nav'
import { UserRound } from 'lucide-react'
import '../styles/uniAdmin.css'

export default function ProfilePage() {
  return (
    <Layout navItems={UNI_ADMIN_NAV} user={UNI_ADMIN_USER} title="Profile" subtitle="Your account">
      <div className="ua-page">
        <div className="ua-card">
          <div className="ua-card-header">
            <p className="ua-card-title"><UserRound size={14} /> Profile</p>
          </div>
          <div className="ua-panel-body">
            <div className="ua-stat-row">
              <span className="ua-stat-label">Name</span>
              <span className="ua-stat-value">{UNI_ADMIN_USER.name}</span>
            </div>
            <div className="ua-stat-row">
              <span className="ua-stat-label">Institution</span>
              <span className="ua-stat-value">{UNI_ADMIN_USER.institution}</span>
            </div>
            <div className="ua-stat-row">
              <span className="ua-stat-label">Role</span>
              <span className="ua-stat-value">{UNI_ADMIN_USER.role}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
