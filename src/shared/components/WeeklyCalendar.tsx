import type { TimetableEntry, DayOfWeek } from '../../uni-admin/api/types'
import './weeklyCalendar.css'

const DAYS: DayOfWeek[] = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']
const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: 'Mon', TUESDAY: 'Tue', WEDNESDAY: 'Wed',
  THURSDAY: 'Thu', FRIDAY: 'Fri', SATURDAY: 'Sat', SUNDAY: 'Sun',
}

const HOUR_START  = 7
const HOUR_END    = 21
const TOTAL_HOURS = HOUR_END - HOUR_START
const ROW_H       = 56   // px per hour slot

function toMinutes(t: string) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function fmtTime(t: string) {
  const [h, m] = t.split(':')
  const hr  = Number(h)
  const ampm = hr >= 12 ? 'PM' : 'AM'
  return `${hr % 12 || 12}:${m} ${ampm}`
}

function topPx(startTime: string)  {
  return ((toMinutes(startTime) - HOUR_START * 60) / 60) * ROW_H
}
function heightPx(startTime: string, endTime: string) {
  return ((toMinutes(endTime) - toMinutes(startTime)) / 60) * ROW_H
}

const TOTAL_H_PX = TOTAL_HOURS * ROW_H

interface Props {
  entries:   TimetableEntry[]
  canEdit?:  boolean
  onAdd?:    () => void
  onEdit?:   (e: TimetableEntry) => void
  onDelete?: (e: TimetableEntry) => void
}

export default function WeeklyCalendar({ entries, canEdit, onAdd, onEdit, onDelete }: Props) {
  const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => HOUR_START + i)

  return (
    <div className="wc-root">

      {/* Toolbar */}
      <div className="wc-toolbar">
        <h2 className="wc-heading">Weekly Timetable</h2>
        {canEdit && onAdd && (
          <button className="ua-btn ua-btn-primary" onClick={onAdd}>+ Add Entry</button>
        )}
      </div>

      {/* Calendar card */}
      <div className="wc-card">

        {/* ── Sticky day header row ── */}
        <div className="wc-header">
          <div className="wc-gutter-cell" />
          {DAYS.map(d => (
            <div key={d} className="wc-day-hdr">{DAY_LABELS[d]}</div>
          ))}
        </div>

        {/* ── Scrollable body ── */}
        <div className="wc-body">

          {/* Hour labels column */}
          <div className="wc-gutter">
            {hours.map(h => (
              <div key={h} className="wc-time-label" style={{ height: ROW_H }}>
                {String(h).padStart(2,'0')}:00
              </div>
            ))}
          </div>

          {/* Day columns — one per day, in DAYS order */}
          <div className="wc-days">
            {DAYS.map(day => {
              const dayEntries = entries.filter(e => e.dayOfWeek === day)
              return (
                <div key={day} className="wc-day-col" style={{ height: TOTAL_H_PX }}>

                  {/* Hour grid lines */}
                  {hours.map(h => (
                    <div key={h} className="wc-grid-line" style={{ top: (h - HOUR_START) * ROW_H }} />
                  ))}

                  {/* Entry blocks */}
                  {dayEntries.map(entry => (
                    <div
                      key={entry.id}
                      className="wc-entry"
                      style={{
                        top:        topPx(entry.startTime),
                        height:     Math.max(heightPx(entry.startTime, entry.endTime) - 4, 20),
                        background: entry.color || '#6366f1',
                      }}
                    >
                      <div className="wc-entry-title">{entry.title}</div>
                      <div className="wc-entry-meta">{entry.room}</div>
                      <div className="wc-entry-meta">
                        {fmtTime(entry.startTime)} – {fmtTime(entry.endTime)}
                      </div>
                      {entry.lecturerName && (
                        <div className="wc-entry-meta">{entry.lecturerName}</div>
                      )}
                      {canEdit && (
                        <div className="wc-entry-actions">
                          <button className="wc-act-btn"
                            onClick={e => { e.stopPropagation(); onEdit?.(entry) }}>✎</button>
                          <button className="wc-act-btn wc-act-del"
                            onClick={e => { e.stopPropagation(); onDelete?.(entry) }}>✕</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </div>
  )
}
