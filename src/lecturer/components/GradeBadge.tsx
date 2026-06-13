import { classifyGrade } from '../grading'
import '../styles/lecturer.css'

interface Props {
  grade: number
  maxPoints: number
  showPercent?: boolean
}

export default function GradeBadge({ grade, maxPoints, showPercent = true }: Props) {
  const c = classifyGrade(grade, maxPoints)
  return (
    <span className={`ua-badge ua-badge-${c.tone}`}>
      {c.label}{showPercent ? ` · ${c.percent}%` : ''}
    </span>
  )
}
