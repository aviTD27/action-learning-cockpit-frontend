import { useCallback, useEffect, useState } from 'react'
import { getStudents, getStudentsByCohort, getStudentsByProgramme } from '../api/uniAdmin'
import { useAuth } from '../../auth/AuthContext'
import type { StudentResponse } from '../api/types'

export function useStudents(opts?: { cohortId?: number; programmeId?: number }) {
  const { universityId } = useAuth()
  const [students, setStudents] = useState<StudentResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cohortId = opts?.cohortId
  const programmeId = opts?.programmeId

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    const req = cohortId != null
      ? getStudentsByCohort(cohortId)
      : programmeId != null
        ? getStudentsByProgramme(programmeId)
        : getStudents(universityId ?? undefined)
    req
      .then(res => setStudents(res.data))
      .catch(() => setError('Failed to load students'))
      .finally(() => setLoading(false))
  }, [cohortId, programmeId, universityId])

  useEffect(() => { reload() }, [reload])

  return { students, loading, error, reload }
}
