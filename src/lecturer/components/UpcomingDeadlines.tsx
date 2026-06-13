import { CalendarClock } from 'lucide-react'
import type { DeadlineItem } from '../lib/dashboardStats'
import '../styles/lecturer.css'

export default function UpcomingDeadlines({ items }: { items: DeadlineItem[] }) {
  return (
    <div className="ua-card">
      <div className="ua-card-header">
        <p className="ua-card-title"><CalendarClock size={14} /> Upcoming Deadlines</p>
      </div>
      <div className="ua-table-wrap">
        {items.length === 0 ? (
          <p className="ua-table-empty">No upcoming deadlines.</p>
        ) : (
          <ul className="ua-deadline-list">
            {items.map(d => (
              <li key={d.id} className="ua-deadline-row">
                <div className="ua-deadline-main">
                  <span className="ua-deadline-title">{d.title}</span>
                  <span className="ua-deadline-cohort">{d.cohortName}</span>
                </div>
                <div className="ua-deadline-meta">
                  <span className="ua-deadline-date">{d.dueDate}</span>
                  <span className={`ua-badge ${d.daysLeft <= 2 ? 'ua-badge-late' : 'ua-badge-completed'}`}>
                    {d.daysLeft === 0 ? 'Due today' : `${d.daysLeft}d left`}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
