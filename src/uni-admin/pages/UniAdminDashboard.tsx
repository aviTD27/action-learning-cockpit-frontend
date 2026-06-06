import Layout from '../../shared/layout/Layout'
import '../styles/UniAdminDashboard.css'

export default function UniAdminDashboard() {
  return (
    <Layout>
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

      <div className="uni-admin-grid">
        <SectionCard title="Cohorts" description="Overview of active and upcoming cohorts." />
        <SectionCard title="Students" description="Student enrollment and progression." />
        <SectionCard title="Lecturers" description="Lecturer assignments and workload." />
        <SectionCard title="Compliance" description="Compliance status and alerts." />
        <SectionCard title="Benchmark" description="Benchmarking across cohorts and institutions." />
      </div>
    </Layout>
  )
}

function SectionCard({ title, description }) {
  return (
    <section className="uni-admin-card">
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  )
}