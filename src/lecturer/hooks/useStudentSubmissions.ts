import { useCallback, useEffect, useState } from 'react'
import { getStudentSubmissions } from '../api/lecturer'
import type { StudentSubmissionResponse } from '../api/types'
import { STUDENT_SUBMISSIONS_ENABLED } from '../config'
import type { StudentSubmission } from '../types'

function toStudentSubmission(r: StudentSubmissionResponse): StudentSubmission {
  return {
    studentId: r.studentId,
    status: r.status,
    uploadId: r.uploadId ?? null,
    fileName: r.fileName,
    submittedAt: r.submittedAt,
    attemptNumber: r.attemptNumber,
    late: r.late,
    reopened: r.reopened,
  }
}

export function useStudentSubmissions(submissionId: number) {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([])
  const [available, setAvailable] = useState(STUDENT_SUBMISSIONS_ENABLED)
  const [loading, setLoading] = useState(STUDENT_SUBMISSIONS_ENABLED)

  const reload = useCallback(() => {
    if (!STUDENT_SUBMISSIONS_ENABLED || !submissionId) {
      setSubmissions([])
      setAvailable(false)
      setLoading(false)
      return Promise.resolve()
    }
    setLoading(true)
    return getStudentSubmissions(submissionId)
      .then(res => {
        setSubmissions(res.data.map(toStudentSubmission))
        setAvailable(true)
      })
      .catch(() => {
        setSubmissions([])
        setAvailable(false)
      })
      .finally(() => setLoading(false))
  }, [submissionId])

  useEffect(() => { reload() }, [reload])

  const submissionFor = useCallback(
    (studentId: number) => submissions.find(s => s.studentId === studentId),
    [submissions],
  )

  const submittedCount = submissions.length

  return { submissions, available, loading, submissionFor, submittedCount, reload }
}
