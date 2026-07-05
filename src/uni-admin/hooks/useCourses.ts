import { useCallback, useEffect, useState } from 'react'
import { getCourses } from '../api/uniAdmin'
import { useAuth } from '../../auth/AuthContext'
import type { CourseResponse } from '../api/types'

export function useCourses(filter?: { semesterId?: number; programmeId?: number }) {
  const { universityId } = useAuth()
  const [courses, setCourses] = useState<CourseResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const semesterId = filter?.semesterId
  const programmeId = filter?.programmeId

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    getCourses({ semesterId, programmeId, universityId: universityId ?? undefined })
      .then(res => setCourses(res.data))
      .catch(() => setError('Failed to load courses'))
      .finally(() => setLoading(false))
  }, [semesterId, programmeId, universityId])

  useEffect(() => { reload() }, [reload])

  return { courses, loading, error, reload }
}
