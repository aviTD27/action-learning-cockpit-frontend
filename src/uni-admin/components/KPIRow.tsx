import '../styles/uniAdmin.css'

interface Stats {
  totalStudents:  number
  activeCohorts:  number
  totalLecturers: number
  checkpointPassRate:   number
  avgNlpScore:    number
}

interface Props {
  stats: Stats | null
}

export default function KPIRow({ stats }: Props) {
  const items = [
    { icon: '👥', value: `${stats?.totalStudents ?? '—'}`, label: 'Total Students', color: ''},
    { icon: '📚', value: `${stats?.activeCohorts ?? '—'}`, label: 'Active Cohorts', color: ''},
    { icon: '👩‍🏫', value: `${stats?.totalLecturers ?? '—'}`, label: 'Lecturers',  color: ''},
    { icon: '✅', value: `${stats?.checkpointPassRate ?? '—'}%`, label: 'Checkpoint Pass Rate', color: 'green' },
    { icon: '🤖', value: `${stats?.avgNlpScore ?? '—'}/100`, label: 'Avg NLP Score', color: 'orange'},
  ]

  return (
    <div className="ua-kpi-row">
      {items.map(item => (
        <div key={item.label} className="ua-kpi-card">
          <span className="ua-kpi-icon">{item.icon}</span>
          <span className={`ua-kpi-value ${item.color}`}>{item.value}</span>
          <span className="ua-kpi-label">{item.label}</span>
        </div>
      ))}
    </div>
  )
}