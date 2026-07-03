import { useEffect, useState } from 'react'
import {
  getAssignmentsForCohort,
  getMyGrades,
  getMyProfile,
  getMyUploadStatus,
  type AssignmentItem,
} from '../api/studentApi'

export interface StudentDashboardStats {
  totalAssignments: number
  submitted: number
  pending: number
  graded: number
}

export interface UpcomingDeadline {
  id: number
  title: string
  deadline: string
  submitted: boolean
  pastDue: boolean
}

export interface RecentGrade {
  id: number
  assignmentTitle: string
  score: number
  maxScore: number
  releasedAt: string
  revised: boolean
}

function toDeadlineISO(a: AssignmentItem): string {
  return a.dueTime ? `${a.dueDate}T${a.dueTime}` : `${a.dueDate}T23:59:59`
}

export function useStudentDashboard() {
  const [stats, setStats] = useState<StudentDashboardStats>({
    totalAssignments: 0,
    submitted: 0,
    pending: 0,
    graded: 0,
  })
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<UpcomingDeadline[]>([])
  const [recentGrades, setRecentGrades] = useState<RecentGrade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const profile = await getMyProfile()

        const [assignments, grades] = await Promise.all([
          getAssignmentsForCohort(profile.cohortId),
          getMyGrades(),
        ])

        const uploadStatuses = await Promise.all(
          assignments.map(a => getMyUploadStatus(a.id))
        )

        const now = Date.now()

        const deadlines: UpcomingDeadline[] = assignments
          .map((a, i) => {
            const dl = new Date(toDeadlineISO(a)).getTime()
            const turnedIn = uploadStatuses[i]?.turnedIn ?? false
            return {
              id: a.id,
              title: a.title,
              deadline: toDeadlineISO(a),
              submitted: turnedIn,
              pastDue: dl < now && !turnedIn,
            }
          })
          .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())

        const submittedCount = uploadStatuses.filter(s => s?.turnedIn).length

        setStats({
          totalAssignments: assignments.length,
          submitted: submittedCount,
          pending: assignments.length - submittedCount,
          graded: grades.length,
        })

        setUpcomingDeadlines(deadlines)

        setRecentGrades(
          [...grades]
            .sort((a, b) => new Date(b.gradedAt).getTime() - new Date(a.gradedAt).getTime())
            .map(g => ({
              id: g.submissionId,
              assignmentTitle: g.submissionTitle,
              score: g.grade,
              maxScore: g.maxPoints,
              releasedAt: g.gradedAt,
              revised: false,
            }))
        )
      } catch (e) {
        console.error('Dashboard load failed', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { stats, upcomingDeadlines, recentGrades, loading }
}
