import Layout from '../../shared/layout/Layout'
import { UNI_ADMIN_NAV, UNI_ADMIN_USER } from '../nav'
import { BarChart3 } from 'lucide-react'
import '../styles/uniAdmin.css'

export default function AnalyticsPage() {
  return (
    <Layout navItems={UNI_ADMIN_NAV} user={UNI_ADMIN_USER} title="Analytics" subtitle="Benchmarking and analytics">
      <div className="ua-page">
        <div className="ua-card">
          <div className="ua-card-header">
            <p className="ua-card-title"><BarChart3 size={14} /> Analytics</p>
          </div>
          <p className="ua-table-empty">Page content</p>
        </div>
      </div>
    </Layout>
  )
}
