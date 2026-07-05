import type { CourseResponse } from '../../uni-admin/api/types'
import type { StudentGrade, Submission } from '../types'

export interface DeadlineItem {
  id: number
  title: string
  courseName: string
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
      return { id: s.id, title: s.title, courseName: s.courseName, dueDate: s.dueDate, daysLeft }
    })
    .filter(d => d.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, limit)
}

export interface CourseBar {
  courseId: number
  courseName: string
  count: number
}

export function submissionsByCourse(submissions: Submission[], courses: CourseResponse[]): CourseBar[] {
  const counts = new Map<number, number>()
  submissions.forEach(s => counts.set(s.courseId, (counts.get(s.courseId) ?? 0) + 1))
  return courses
    .map(c => ({ courseId: c.id, courseName: c.name, count: counts.get(c.id) ?? 0 }))
    .filter(b => b.count > 0)
    .sort((a, b) => b.count - a.count)
}

export interface CourseProgressItem {
  courseId: number
  courseName: string
  programmeName: string
  students: number
  deliverables: number
  gradedPct: number
  avgPercent: number | null
}

export function courseProgress(
  courses: CourseResponse[],
  submissions: Submission[],
  grades: StudentGrade[],
): CourseProgressItem[] {
  const maxBySubmission = new Map<number, number>()
  submissions.forEach(s => maxBySubmission.set(s.id, s.maxPoints))

  return courses.map(c => {
    const subs = submissions.filter(s => s.courseId === c.id)
    const subIds = new Set(subs.map(s => s.id))
    const students = c.studentCount
    const expected = students * subs.length

    const courseGrades = grades.filter(g => subIds.has(g.submissionId))
    const percents = courseGrades.map(g => (g.grade / (maxBySubmission.get(g.submissionId) || 1)) * 100)
    const avgPercent = percents.length
      ? Math.round(percents.reduce((a, b) => a + b, 0) / percents.length)
      : null
    const gradedPct = expected > 0 ? Math.round((courseGrades.length / expected) * 100) : 0

    return {
      courseId: c.id,
      courseName: c.name,
      programmeName: c.programmeName,
      students,
      deliverables: subs.length,
      gradedPct,
      avgPercent,
    }
  })
}
