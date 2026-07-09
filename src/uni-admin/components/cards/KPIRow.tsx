import { BookOpen, GraduationCap, Play, Presentation, UserCheck, Users } from 'lucide-react'
import type { UniAdminStats } from '../../hooks/useUniAdminStats'
import '../../styles/uniAdmin.css'

interface Props {
  stats: UniAdminStats | null
}

export default function KPIRow({ stats }: Props) {
  const KPIS = [
    { icon: BookOpen, label: 'Programmes',value: stats?.totalProgrammes },
    { icon: Users, label: 'Cohorts', value: stats?.totalCohorts },
    { icon: Play, label: 'Ongoing Cohorts', value: stats?.activeCohorts, color: 'green' },
    { icon: Presentation, label: 'Lecturers', value: stats?.totalLecturers },
    { icon: GraduationCap, label: 'Students', value: stats?.totalStudents },
    { icon: UserCheck, label: 'Active Students', value: stats?.activeStudents, color: 'green' },
  ]

  return (
    <div className="ua-kpi-row">
      {KPIS.map(k => (
        <div className="ua-kpi-card" key={k.label}>
          <span className={`ua-kpi-icon ${k.color ?? ''}`}><k.icon size={20} /></span>
          <span className={`ua-kpi-value ${k.color ?? ''}`}>{k.value ?? ''}</span>
          <span className="ua-kpi-label">{k.label}</span>
        </div>
      ))}
    </div>
  )
}
