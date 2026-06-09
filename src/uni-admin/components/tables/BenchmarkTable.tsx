import '../../styles/benchmark.css'

interface CohortRow {
  cohort: string
  programme: string
  students: number
  checkpointPass: number
  nlpAvg: number
  onTime: number
  rank: number
}

const DATA: CohortRow[] = [
  { cohort:'MSc-2023-Spring',  programme:'MSc Software Eng', students:32, checkpointPass:88, nlpAvg:76, onTime:91, rank:1 },
  { cohort:'MSc-2023-Fall',  programme:'MSc Software Eng', students:28, checkpointPass:82, nlpAvg:71, onTime:85, rank:2 },
  { cohort:'MSc-2024-Spring',  programme:'MSc Computer Security', students:36, checkpointPass:75, nlpAvg:68, onTime:80, rank:3 },
  { cohort:'MSc-2024-Fall',  programme:'MSc Computer Security', students:24, checkpointPass:70, nlpAvg:64, onTime:74, rank:4 },
  { cohort:'MSc-2025-Spring',  programme:'MSc Data Science', students:18, checkpointPass:65, nlpAvg:60, onTime:70, rank:5 },
  { cohort:'MSc-2025-Fall', programme:'MSc Data Science', students:20, checkpointPass:60, nlpAvg:58, onTime:68, rank:6 },
]

const MEDALS: Record<number, string> = { 1:'🥇', 2:'🥈', 3:'🥉' }

function rateClass(value: number) {
  if (value >= 80) return 'rate-good'
  if (value >= 65) return 'rate-mid'
  return 'rate-bad'
}

export default function BenchmarkTable() {
  return (
    <div className="benchmark-card">

      <div className="benchmark-header">
        <div>
          <p className="benchmark-title">
            📊 Cohort Performance Benchmark with the University
          </p>
          <p className="benchmark-subtitle">
            Comparing all cohorts within the university
          </p>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="benchmark-table">
          <thead>
            <tr>
              <th>Cohort</th>
              <th>Programme</th>
              <th>Students</th>
              <th>checkpoint Pass %</th>
              <th>NLP Avg</th>
              <th>On-Time %</th>
              <th>Rank</th>
            </tr>
          </thead>
          <tbody>
            {DATA.map(row => (
              <tr
                key={row.cohort}
                className={row.rank <= 3 ? 'top-row' : ''}
              >
                <td className="cohort-name">{row.cohort}</td>
                <td style={{ color: '#6b7280' }}>{row.programme}</td>
                <td>{row.students}</td>
                <td className={rateClass(row.checkpointPass)}>
                  {row.checkpointPass}%
                </td>
                <td style={{ color: '#ea580c' }}>{row.nlpAvg}</td>
                <td className={rateClass(row.onTime)}>
                  {row.onTime}%
                </td>
                <td className="rank-cell">
                  {MEDALS[row.rank] ?? `#${row.rank}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}