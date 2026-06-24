import { useCallback, useEffect, useState } from 'react'
import { getStudents, getStudentsByCohort } from '../api/uniAdmin'
import { useAuth } from '../../auth/AuthContext'
import type { StudentResponse } from '../api/types'

export function useStudents(cohortId?: number) {
  const { universityId } = useAuth()
  const [students, setStudents] = useState<StudentResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    const req = cohortId != null ? getStudentsByCohort(cohortId) : getStudents(universityId ?? undefined)
    req
      .then(res => setStudents(res.data))
      .catch(() => setError('Failed to load students'))
      .finally(() => setLoading(false))
  }, [cohortId, universityId])

  useEffect(() => { reload() }, [reload])

  return { students, loading, error, reload }
}
