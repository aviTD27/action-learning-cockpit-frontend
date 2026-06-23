import { useCallback, useEffect, useState } from 'react'
import { getLecturers } from '../api/uniAdmin'
import { useAuth } from '../../auth/AuthContext'
import type { LecturerResponse } from '../api/types'

export function useLecturers() {
  const { universityId } = useAuth()
  const [lecturers, setLecturers] = useState<LecturerResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    getLecturers(universityId ?? undefined)
      .then(res => setLecturers(res.data))
      .catch(() => setError('Failed to load lecturers'))
      .finally(() => setLoading(false))
  }, [universityId])

  useEffect(() => { reload() }, [reload])

  return { lecturers, loading, error, reload }
}
