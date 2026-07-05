import { useEffect, useState } from 'react'
import { AlertTriangle, Brain, X } from 'lucide-react'
import { getSubmissionScore } from '../api/lecturer'
import type { ScoringReport } from '../api/types'
import '../styles/lecturer.css'

interface Props {
  open: boolean
  studentName: string
  uploadId: number | null
  onClose: () => void
}

const LEVEL_CLASS: Record<string, string> = {
  excellent: 'ua-score-excellent',
  good:      'ua-score-good',
  average:   'ua-score-average',
  poor:      'ua-score-poor',
}

const CONF_CLASS: Record<string, string> = {
  high:   'ua-conf-high',
  medium: 'ua-conf-medium',
  low:    'ua-conf-low',
}

function ScoreBar({ score }: { score: number }) {
  const pct = Math.round(score * 100)
  const color = pct >= 65 ? '#16a34a' : pct >= 40 ? '#d97706' : '#dc2626'
  return (
    <div className="ua-score-bar-track">
      <div className="ua-score-bar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

export default function ScoreModal({ open, studentName, uploadId, onClose }: Props) {
  const [report, setReport] = useState<ScoringReport | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !uploadId) return
    setLoading(true)
    setReport(null)
    getSubmissionScore(uploadId)
      .then(r => setReport(r.data))
      .catch(() => setReport(null))
      .finally(() => setLoading(false))
  }, [open, uploadId])

  if (!open) return null

  return (
    <div className="ua-modal-overlay" onClick={onClose}>
      <div className="ua-modal ua-score-modal" onClick={e => e.stopPropagation()}>
        <div className="ua-score-modal-header">
          <h2 className="ua-modal-title"><Brain size={16} /> AI Assessment — {studentName}</h2>
          <button className="ua-icon-btn" onClick={onClose}><X size={15} /></button>
        </div>

        {loading && <p className="ua-table-empty">Loading score…</p>}

        {!loading && !report && (
          <p className="ua-table-empty">No score available for this submission.</p>
        )}

        {report && (
          <>
            <div className="ua-score-summary">
              <span className={`ua-score-level ${LEVEL_CLASS[report.level] ?? ''}`}>
                {report.level.charAt(0).toUpperCase() + report.level.slice(1)}
              </span>
              <span className="ua-score-overall">
                {Math.round(report.overallScore * 100)}%
              </span>
              <span className="ua-score-wc">{report.wordCount.toLocaleString()} words</span>
            </div>

            {report.requiresHumanReview && (
              <div className="ua-review-warning">
                <AlertTriangle size={13} />
                One or more criteria have low confidence — human review recommended.
              </div>
            )}

            <div className="ua-criteria-list">
              {report.criteria.map(c => (
                <div key={c.label} className="ua-criterion">
                  <div className="ua-criterion-top">
                    <span className="ua-criterion-label">{c.label}</span>
                    <div className="ua-criterion-right">
                      {c.requiresReview && (
                        <span className={`ua-conf-badge ${CONF_CLASS['low']}`}>Review</span>
                      )}
                      {!c.requiresReview && c.confidence === 'medium' && (
                        <span className={`ua-conf-badge ${CONF_CLASS['medium']}`}>Uncertain</span>
                      )}
                      <span className="ua-criterion-pct">{Math.round(c.score * 100)}%</span>
                    </div>
                  </div>
                  <ScoreBar score={c.score} />
                  <p className="ua-criterion-feedback">{c.feedback}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
