import { useEffect, useState } from 'react'
import { getMyCohort, type CohortInfo } from '../api/studentApi'

export function useStudentCohort() {
  const [cohort, setCohort] = useState<CohortInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getMyCohort()
      .then(setCohort)
      .catch(() => setError('Failed to load cohort info.'))
      .finally(() => setLoading(false))
  }, [])

  return { cohort, loading, error }
}
