import { useCallback, useEffect, useState } from 'react'
import { getGrades, getSubmissions, releaseGrades } from '../api/lecturer'
import type { GradeResponse } from '../api/types'
import type { StudentGrade } from '../types'

function toStudentGrade(submissionId: number, r: GradeResponse): StudentGrade {
  return {
    submissionId,
    studentId: r.studentId,
    grade: r.grade,
    feedback: r.feedback ?? '',
    status: r.status,
    gradedAt: r.gradedAt,
  }
}

export function useGradeOverview() {
  const [grades, setGrades] = useState<StudentGrade[]>([])

  const reload = useCallback(async () => {
    try {
      const subs = (await getSubmissions()).data
      const perSubmission = await Promise.all(
        subs.map(s =>
          getGrades(s.id)
            .then(res => res.data.map(g => toStudentGrade(s.id, g)))
            .catch(() => [] as StudentGrade[]),
        ),
      )
      setGrades(perSubmission.flat())
    } catch {
      setGrades([])
    }
  }, [])

  useEffect(() => {
    reload()

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        reload()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [reload])

  const releaseSubmission = useCallback(async (submissionId: number) => {
    await releaseGrades(submissionId)
    await reload()
  }, [reload])

  const summaryFor = useCallback((submissionId: number) => {
    const forSubmission = grades.filter(g => g.submissionId === submissionId)
    return {
      graded: forSubmission.length,
      draft: forSubmission.filter(g => g.status === 'DRAFT').length,
      released: forSubmission.filter(g => g.status === 'RELEASED').length,
    }
  }, [grades])

  return { grades, releaseSubmission, summaryFor }
}
