import { useEffect, useState } from 'react'
import { getMyGrades, type GradeItem } from '../api/studentApi'

export function useStudentGrades() {
  const [grades, setGrades]   = useState<GradeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    getMyGrades()
      .then(setGrades)
      .catch(() => setError('Failed to load grades.'))
      .finally(() => setLoading(false))
  }, [])

  return { grades, loading, error }
}
