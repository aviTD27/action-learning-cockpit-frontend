import { useCallback, useEffect, useState } from 'react'
import {
  getGrades,
  releaseGrades,
  setGrade as setGradeApi,
} from '../api/lecturer'
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

export function useGrades(submissionId: number) {
  const [grades, setGrades] = useState<StudentGrade[]>([])

  const refresh = useCallback(() => {
    if (!submissionId) return Promise.resolve()
    return getGrades(submissionId)
      .then(res => setGrades(res.data.map(g => toStudentGrade(submissionId, g))))
      .catch(() => setGrades([]))
  }, [submissionId])

  useEffect(() => { refresh() }, [refresh])

  const setGrade = useCallback(async (studentId: number, grade: number, feedback: string) => {
    await setGradeApi(submissionId, studentId, { grade, feedback })
    await refresh()
  }, [submissionId, refresh])

  const releaseAll = useCallback(async () => {
    await releaseGrades(submissionId)
    await refresh()
  }, [submissionId, refresh])

  const gradeFor = useCallback(
    (studentId: number) => grades.find(g => g.studentId === studentId),
    [grades],
  )

  const draftCount = grades.filter(g => g.status === 'DRAFT').length

  return { grades, setGrade, releaseAll, gradeFor, draftCount }
}
