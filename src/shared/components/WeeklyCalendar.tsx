import type { TimetableEntry, DayOfWeek } from '../../uni-admin/api/types'
import './weeklyCalendar.css'

const DAYS: DayOfWeek[] = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']
const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: 'Mon', TUESDAY: 'Tue', WEDNESDAY: 'Wed',
  THURSDAY: 'Thu', FRIDAY: 'Fri', SATURDAY: 'Sat', SUNDAY: 'Sun',
}

const HOUR_START = 7
const HOUR_END = 21
const TOTAL_HOURS = HOUR_END - HOUR_START
const ROW_H = 56

function toMinutes(t: string) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function fmtTime(t: string) {
  const [h, m] = t.split(':')
  const hr = Number(h)
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`
}

function topPx(startTime: string) {
  return ((toMinutes(startTime) - HOUR_START * 60) / 60) * ROW_H
}
function heightPx(startTime: string, endTime: string) {
  return ((toMinutes(endTime) - toMinutes(startTime)) / 60) * ROW_H
}

const TOTAL_H_PX = TOTAL_HOURS * ROW_H

interface LayoutEntry {
  entry: TimetableEntry
  colIndex: number
  colTotal: number
}

function overlaps(s1: number, e1: number, s2: number, e2: number) {
  return s1 < e2 && e1 > s2
}

function layoutEntries(entries: TimetableEntry[]): LayoutEntry[] {
  if (entries.length === 0) return []

  const sorted = [...entries].sort((a, b) => {
    const d = toMinutes(a.startTime) - toMinutes(b.startTime)
    return d !== 0 ? d : toMinutes(b.endTime) - toMinutes(a.endTime)
  })

  const colEnd: number[] = []
  const assigned: number[] = new Array(sorted.length).fill(0)

  for (let i = 0; i < sorted.length; i++) {
    const start = toMinutes(sorted[i].startTime)

    let col = colEnd.findIndex(e => e <= start)
    if (col === -1) col = colEnd.length

    if (col === colEnd.length) colEnd.push(0)
    colEnd[col] = toMinutes(sorted[i].endTime)
    assigned[i] = col
  }

  return sorted.map((entry, i) => {
    const start = toMinutes(entry.startTime)
    const end   = toMinutes(entry.endTime)

    let maxCol = 0
    for (let j = 0; j < sorted.length; j++) {
      if (overlaps(toMinutes(sorted[j].startTime), toMinutes(sorted[j].endTime), start, end)) {
        if (assigned[j] > maxCol) maxCol = assigned[j]
      }
    }

    return { entry, colIndex: assigned[i], colTotal: maxCol + 1 }
  })
}

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

      <div className="wc-toolbar">
        <h2 className="wc-heading">Weekly Timetable</h2>
        {canEdit && onAdd && (
          <button className="ua-btn ua-btn-primary" onClick={onAdd}>+ Add Entry</button>
        )}
      </div>

      <div className="wc-card">

        <div className="wc-header">
          <div className="wc-gutter-cell" />
          {DAYS.map(d => (
            <div key={d} className="wc-day-hdr">{DAY_LABELS[d]}</div>
          ))}
        </div>

        <div className="wc-body">

          <div className="wc-gutter">
            {hours.map(h => (
              <div key={h} className="wc-time-label" style={{ height: ROW_H }}>
                {String(h).padStart(2,'0')}:00
              </div>
            ))}
          </div>

          <div className="wc-days">
            {DAYS.map(day => {
              const dayEntries = entries.filter(e => e.dayOfWeek === day)
              const laid = layoutEntries(dayEntries)

              return (
                <div key={day} className="wc-day-col" style={{ height: TOTAL_H_PX }}>

                  {hours.map(h => (
                    <div key={h} className="wc-grid-line" style={{ top: (h - HOUR_START) * ROW_H }} />
                  ))}

                  {laid.map(({ entry, colIndex, colTotal }) => {
                    const h = Math.max(heightPx(entry.startTime, entry.endTime) - 4, 20)
                    const compact = colTotal > 2

                    const gutter = 3, gap = 2
                    const unit = `(100% - ${gutter * 2 + gap * (colTotal - 1)}px) / ${colTotal}`
                    const left = colIndex === 0
                      ? `${gutter}px`
                      : `calc(${gutter}px + ${colIndex} * (${unit}) + ${colIndex * gap}px)`
                    const width = `calc(${unit})`

                    return (
                      <div
                        key={entry.id}
                        className={`wc-entry${compact ? ' wc-entry--compact' : ''}`}
                        style={{
                          top: topPx(entry.startTime),
                          height: h,
                          left,
                          width,
                          background: entry.color || '#6366f1',
                        }}
                        title={`${entry.title}  ${entry.lecturerName ?? ''} · ${entry.cohortName} · ${entry.room}`}
                      >
                        <div className="wc-entry-title">{entry.title}</div>

                        {entry.lecturerName && (
                          <div className="wc-entry-meta wc-entry-lecturer">{entry.lecturerName}</div>
                        )}

                        {!compact && (
                          <>
                            <div className="wc-entry-meta">{entry.cohortName}</div>
                            {entry.room && (
                              <div className="wc-entry-meta">{entry.room}</div>
                            )}
                            {entry.programmeNames && entry.programmeNames.length > 0 && (
                              <div className="wc-entry-prog">{entry.programmeNames[0]}</div>
                            )}
                            <div className="wc-entry-meta">
                              {fmtTime(entry.startTime)} – {fmtTime(entry.endTime)}
                            </div>
                          </>
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
                    )
                  })}
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </div>
  )
}
