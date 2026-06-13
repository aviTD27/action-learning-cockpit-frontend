import type { CohortResponse } from '../../uni-admin/api/types'
import type { StudentGrade, Submission } from '../types'

export interface DeadlineItem {
  id: number
  title: string
  cohortName: string
  dueDate: string
  daysLeft: number
}

export function upcomingDeadlines(submissions: Submission[], limit = 5): DeadlineItem[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return submissions
    .map(s => {
      const due = new Date(s.dueDate)
      due.setHours(0, 0, 0, 0)
      const daysLeft = Math.round((due.getTime() - today.getTime()) / 86_400_000)
      return { id: s.id, title: s.title, cohortName: s.cohortName, dueDate: s.dueDate, daysLeft }
    })
    .filter(d => d.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, limit)
}

export interface CohortBar {
  cohortId: number
  cohortName: string
  count: number
}

export function submissionsByCohort(submissions: Submission[], cohorts: CohortResponse[]): CohortBar[] {
  const counts = new Map<number, number>()
  submissions.forEach(s => counts.set(s.cohortId, (counts.get(s.cohortId) ?? 0) + 1))
  return cohorts
    .map(c => ({ cohortId: c.id, cohortName: c.name, count: counts.get(c.id) ?? 0 }))
    .filter(b => b.count > 0)
    .sort((a, b) => b.count - a.count)
}

export interface CohortProgressItem {
  cohortId: number
  cohortName: string
  programmeName: string
  students: number
  deliverables: number
  gradedPct: number
  avgPercent: number | null
}

export function cohortProgress(
  cohorts: CohortResponse[],
  submissions: Submission[],
  grades: StudentGrade[],
  studentCountByCohort: Map<number, number>,
): CohortProgressItem[] {
  const maxBySubmission = new Map<number, number>()
  submissions.forEach(s => maxBySubmission.set(s.id, s.maxPoints))

  return cohorts.map(c => {
    const subs = submissions.filter(s => s.cohortId === c.id)
    const subIds = new Set(subs.map(s => s.id))
    const students = studentCountByCohort.get(c.id) ?? 0
    const expected = students * subs.length

    const cohortGrades = grades.filter(g => subIds.has(g.submissionId))
    const percents = cohortGrades.map(g => (g.grade / (maxBySubmission.get(g.submissionId) || 1)) * 100)
    const avgPercent = percents.length
      ? Math.round(percents.reduce((a, b) => a + b, 0) / percents.length)
      : null
    const gradedPct = expected > 0 ? Math.round((cohortGrades.length / expected) * 100) : 0

    return {
      cohortId: c.id,
      cohortName: c.name,
      programmeName: c.programmeName,
      students,
      deliverables: subs.length,
      gradedPct,
      avgPercent,
    }
  })
}
