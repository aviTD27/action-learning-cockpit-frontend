import type { CohortBenchmark } from '../../api/types'
import '../../styles/benchmark.css'

const MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

function rateClass(value: number) {
  if (value >= 80) return 'rate-good'
  if (value >= 65) return 'rate-mid'
  return 'rate-bad'
}

export default function BenchmarkTable({ rows }: { rows: CohortBenchmark[] }) {
  return (
    <div className="benchmark-card">

      <div className="benchmark-header">
        <div>
          <p className="benchmark-title">
            📊 Cohort Performance Benchmark
          </p>
          <p className="benchmark-subtitle">
            All cohorts within your university, ranked by average released grade
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
              <th>Assignments</th>
              <th>Released</th>
              <th>Avg Score %</th>
              <th>Rank</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: '#9ca3af', padding: '1.25rem' }}>
                  No cohort data yet
                </td>
              </tr>
            ) : rows.map(row => (
              <tr key={row.cohortId} className={row.rank <= 3 ? 'top-row' : ''}>
                <td className="cohort-name">{row.cohortName}</td>
                <td style={{ color: '#6b7280' }}>{row.programmeName ?? ''}</td>
                <td>{row.students}</td>
                <td>{row.submissions}</td>
                <td>{row.releasedGrades}</td>
                <td className={rateClass(row.avgScorePct)}>{row.avgScorePct}%</td>
                <td className="rank-cell">{MEDALS[row.rank] ?? `#${row.rank}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
