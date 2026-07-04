import { useCallback, useEffect, useState } from 'react'
import { getSemesters } from '../api/uniAdmin'
import { useAuth } from '../../auth/AuthContext'
import type { SemesterResponse } from '../api/types'

export function useSemesters(programmeId?: number) {
  const { universityId } = useAuth()
  const [semesters, setSemesters] = useState<SemesterResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    getSemesters({ programmeId, universityId: universityId ?? undefined })
      .then(res => setSemesters(res.data))
      .catch(() => setError('Failed to load semesters'))
      .finally(() => setLoading(false))
  }, [programmeId, universityId])

  useEffect(() => { reload() }, [reload])

  return { semesters, loading, error, reload }
}
