import { useCallback, useEffect, useState } from 'react'
import { getLecturers } from '../api/uniAdmin'
import { CURRENT_UNIVERSITY_ID } from '../tenant'
import type { LecturerResponse } from '../api/types'

export function useLecturers() {
  const [lecturers, setLecturers] = useState<LecturerResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    getLecturers(CURRENT_UNIVERSITY_ID)
      .then(res => setLecturers(res.data))
      .catch(() => setError('Failed to load lecturers'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { reload() }, [reload])

  return { lecturers, loading, error, reload }
}
