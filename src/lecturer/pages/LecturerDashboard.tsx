import { ClipboardList, Play, Users } from 'lucide-react'
import Layout from '../../shared/layout/Layout'
import { LECTURER_NAV, LECTURER_USER } from '../nav'
import { useCohorts } from '../../uni-admin/hooks/useCohorts'
import { useStudents } from '../../uni-admin/hooks/useStudents'
import { useSubmissions } from '../hooks/useSubmissions'
import { useGradeOverview } from '../hooks/useGradeOverview'
import SubmissionTable from '../components/SubmissionTable'
import CohortProgressCards from '../components/CohortProgressCards'
import UpcomingDeadlines from '../components/UpcomingDeadlines'
import SubmissionsByCohort from '../components/SubmissionsByCohort'
import { cohortProgress, submissionsByCohort, upcomingDeadlines } from '../lib/dashboardStats'
import '../styles/lecturer.css'

export default function LecturerDashboard() {
  const { cohorts } = useCohorts()
  const { submissions } = useSubmissions()
  const { students } = useStudents()
  const { grades } = useGradeOverview()

  const ongoing = cohorts.filter(c => c.status === 'ONGOING')

  const studentCountByCohort = new Map<number, number>()
  students.forEach(s => studentCountByCohort.set(s.cohortId, (studentCountByCohort.get(s.cohortId) ?? 0) + 1))

  const progress = cohortProgress(ongoing, submissions, grades, studentCountByCohort)
  const deadlines = upcomingDeadlines(submissions)
  const byCohort = submissionsByCohort(submissions, cohorts)

  const KPIS = [
    { icon: Users, label: 'Cohorts', value: cohorts.length },
    { icon: Play, label: 'Ongoing Cohorts', value: ongoing.length, color: 'green' },
    { icon: ClipboardList, label: 'Submissions', value: submissions.length },
  ]

  return (
    <Layout navItems={LECTURER_NAV} user={LECTURER_USER} title="Lecturer Dashboard" subtitle="EPITA Action Learning Cockpit">
      <div className="ua-page">

        <div className="ua-kpi-row">
          {KPIS.map(k => (
            <div className="ua-kpi-card" key={k.label}>
              <span className={`ua-kpi-icon ${k.color ?? ''}`}><k.icon size={20} /></span>
              <span className={`ua-kpi-value ${k.color ?? ''}`}>{k.value}</span>
              <span className="ua-kpi-label">{k.label}</span>
            </div>
          ))}
        </div>

        <CohortProgressCards items={progress} />

        <div className="ua-dash-cols">
          <UpcomingDeadlines items={deadlines} />
          <SubmissionsByCohort bars={byCohort} />
        </div>

        <SubmissionTable />

      </div>
    </Layout>
  )
}
