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

export function useStudentDashboard() {
  const stats: StudentDashboardStats = {
    totalAssignments: 0,
    submitted: 0,
    pending: 0,
    graded: 0,
  }

  return {
    stats,
    upcomingDeadlines: [] as UpcomingDeadline[],
    recentGrades: [] as RecentGrade[],
    loading: false,
  }
}
