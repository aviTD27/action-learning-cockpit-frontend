import type { TimetableEntry, DayOfWeek } from '../../uni-admin/api/types'
import './weeklyCalendar.css'

const DAYS: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: 'Mon', TUESDAY: 'Tue', WEDNESDAY: 'Wed',
  THURSDAY: 'Thu', FRIDAY: 'Fri', SATURDAY: 'Sat', SUNDAY: 'Sun',
}

const START_HOUR = 7
const END_HOUR   = 21
const TOTAL_HOURS = END_HOUR - START_HOUR

function toMinutes(time: string) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function formatTime(time: string) {
  const [h, m] = time.split(':')
  const hour = Number(h)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12  = hour % 12 || 12
  return `${h12}:${m} ${ampm}`
}

interface Props {
  entries: TimetableEntry[]
  onAdd?:    () => void
  onEdit?:   (entry: TimetableEntry) => void
  onDelete?: (entry: TimetableEntry) => void
  canEdit?:  boolean
}

export default function WeeklyCalendar({ entries, onAdd, onEdit, onDelete, canEdit }: Props) {
  const hourSlots = Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i)

  function getEntries(day: DayOfWeek) {
    return entries.filter(e => e.dayOfWeek === day)
  }

  function topPct(startTime: string) {
    const mins = toMinutes(startTime) - START_HOUR * 60
    return (mins / (TOTAL_HOURS * 60)) * 100
  }

  function heightPct(startTime: string, endTime: string) {
    const dur = toMinutes(endTime) - toMinutes(startTime)
    return (dur / (TOTAL_HOURS * 60)) * 100
  }

  return (
    <div className="wc-root">

      {/* Toolbar */}
      <div className="wc-toolbar">
        <h2 className="wc-heading">Weekly Timetable</h2>
        {canEdit && onAdd && (
          <button className="ua-btn ua-btn-primary" onClick={onAdd}>
            + Add Entry
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="wc-scroll">
        <div className="wc-grid">

          {/* Corner */}
          <div className="wc-corner" />

          {/* Day headers */}
          {DAYS.map(day => (
            <div key={day} className="wc-day-header">{DAY_LABELS[day]}</div>
          ))}

          {/* Hour labels */}
          {hourSlots.map(h => (
            <div key={h} className="wc-hour-label">
              {pad(h)}:00
            </div>
          ))}

          {/* Day columns */}
          {DAYS.map(day => (
            <div key={day} className="wc-col">
              {/* Hour grid lines */}
              {hourSlots.map(h => (
                <div key={h} className="wc-cell" />
              ))}

              {/* Entries */}
              {getEntries(day).map(entry => (
                <div
                  key={entry.id}
                  className="wc-entry"
                  style={{
                    top:    `${topPct(entry.startTime)}%`,
                    height: `${heightPct(entry.startTime, entry.endTime)}%`,
                    background: entry.color || '#6366f1',
                  }}
                >
                  <div className="wc-entry-title">{entry.title}</div>
                  <div className="wc-entry-meta">{entry.room}</div>
                  <div className="wc-entry-meta">
                    {formatTime(entry.startTime)} – {formatTime(entry.endTime)}
                  </div>
                  {entry.lecturerName && (
                    <div className="wc-entry-meta">{entry.lecturerName}</div>
                  )}

                  {canEdit && (
                    <div className="wc-entry-actions">
                      <button
                        className="wc-action-btn"
                        onClick={e => { e.stopPropagation(); onEdit?.(entry) }}
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        className="wc-action-btn wc-action-delete"
                        onClick={e => { e.stopPropagation(); onDelete?.(entry) }}
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
