export type GradeBand = 'FAIL' | 'PASS' | 'GOOD' | 'DISTINCTION'

export interface GradeClassification {
  band: GradeBand
  label: string
  percent: number
  tone: 'fail' | 'pass' | 'good' | 'distinction'
}

export function classifyGrade(grade: number, maxPoints: number): GradeClassification {
  const raw = maxPoints > 0 ? (grade / maxPoints) * 100 : 0
  const percent = Math.round(raw)

  if (raw < 40) return { band: 'FAIL', label: 'Fail', percent, tone: 'fail' }
  if (raw < 60) return { band: 'PASS', label: 'Pass', percent, tone: 'pass' }
  if (raw < 80) return { band: 'GOOD', label: 'Good', percent, tone: 'good' }
  return { band: 'DISTINCTION', label: 'Distinction', percent, tone: 'distinction' }
}
