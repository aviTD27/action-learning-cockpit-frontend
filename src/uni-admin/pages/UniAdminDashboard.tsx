import Layout from '../../shared/layout/Layout'
import KPIRow from '../components/cards/KPIRow'
import { useUniAdminStats } from '../hooks/useUniAdminStats'
import '../styles/UniAdminDashboard.css'
import CohortTable from '../components/tables/CohortTable'
import StudentPanel  from '../components/panels/StudentPanel'
import LecturerPanel from '../components/panels/LecturerPanel'
import ComplianceStats  from '../components/cards/ComplianceStats'
import BenchmarkTable from '../components/tables/BenchmarkTable'

const NAV = [
  { label: 'Overview', icon: '🏠',  path: '/uni-admin' },
  { label: 'Cohort Management', icon: '👥',  path: '/uni-admin/cohorts' },
  { label: 'Lecturers', icon: '👩‍🏫', path: '/uni-admin/lecturers' },
  { label: 'Students', icon: '🎓',  path: '/uni-admin/students' },
  { label: 'Compliance', icon: '📋',  path: '/uni-admin/compliance' },
  { label: 'Analytics', icon: '📊',  path: '/uni-admin/analytics' },
  { label: 'Settings', icon: '⚙️',  path: '/uni-admin/settings' },
]

export default function UniAdminDashboard() {
  const { stats } = useUniAdminStats()
  return (
    <Layout navItems={NAV}>
      <header className="uni-admin-header">
         <div>
           <h1 className="title">University Admin</h1>
           <p className="subtitle">
             Epita Action Learning Cockpit Dashboard
           </p>
         </div>

         <div className="user-info">
           <p className="name">Avi Doorga</p>
           <p className="role">University Admin</p>
         </div>
      </header>

      {/* <KPIRow stats={stats} />

      <CohortTable />

      <div className="ua-two-col">
        <StudentPanel />
        <LecturerPanel />
      </div> */}

      <div className="ua-page">
        <KPIRow stats={stats} />
        <CohortTable />
        <div className="ua-two-col">
          <StudentPanel />
          <LecturerPanel />
        </div>
        <ComplianceStats />
        <BenchmarkTable />
      </div>


      {/* <div className="uni-admin-grid">
        <SectionCard title="Cohorts" description="Overview of active and upcoming cohorts." />
        <SectionCard title="Students" description="Student enrollment and progression." />
        <SectionCard title="Lecturers" description="Lecturer assignments and workload." />
        <SectionCard title="Compliance" description="Compliance status and alerts." />
        <SectionCard title="Benchmark" description="Benchmarking across cohorts and institutions." />
      </div> */}
    </Layout>
  )
}

// function SectionCard({ title, description }) {
//   return (
//     <section className="uni-admin-card">
//       <h2>{title}</h2>
//       <p>{description}</p>
//     </section>
//   )
// }