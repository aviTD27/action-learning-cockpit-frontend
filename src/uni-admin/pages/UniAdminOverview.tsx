import { Link } from 'react-router-dom'
import { BookOpen, GraduationCap, Presentation, Users } from 'lucide-react'
import Layout from '../../shared/layout/Layout'
import { UNI_ADMIN_NAV, UNI_ADMIN_USER } from '../nav'
import KPIRow from '../components/cards/KPIRow'
import CohortTable from '../components/tables/CohortTable'
import StudentPanel from '../components/panels/StudentPanel'
import LecturerPanel from '../components/panels/LecturerPanel'
import { useUniAdminStats } from '../hooks/useUniAdminStats'
import '../styles/uniAdmin.css'

const QUICK_ACTIONS = [
  { icon: BookOpen, label: 'New Programme', to: '/uni-admin/programmes' },
  { icon: Users, label: 'New Cohort', to: '/uni-admin/cohorts' },
  { icon: Presentation, label: 'Add Lecturer', to: '/uni-admin/lecturers' },
  { icon: GraduationCap, label: 'Enroll Student', to: '/uni-admin/students' },
]

export default function UniAdminOverview() {
  const { stats } = useUniAdminStats()

  return (
    <Layout navItems={UNI_ADMIN_NAV} user={UNI_ADMIN_USER} title="University Admin" subtitle="Overview · EPITA Action Learning Cockpit">
      <div className="ua-page">

        <KPIRow stats={stats} />

        <div className="ua-quick-actions">
          {QUICK_ACTIONS.map(a => (
            <Link key={a.to} to={a.to} className="ua-quick-action">
              <span className="ua-quick-action-icon"><a.icon size={16} /></span>
              {a.label}
            </Link>
          ))}
        </div>

        <CohortTable />

        <div className="ua-two-col">
          <StudentPanel />
          <LecturerPanel />
        </div>

      </div>
    </Layout>
  )
}
