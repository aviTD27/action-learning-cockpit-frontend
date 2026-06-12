import { useCallback, useEffect, useState } from 'react'
import { getCohorts } from '../api/uniAdmin'
import { CURRENT_UNIVERSITY_ID } from '../tenant'
import type { CohortResponse } from '../api/types'

export function useCohorts() {
  const [cohorts, setCohorts] = useState<CohortResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    getCohorts(CURRENT_UNIVERSITY_ID)
      .then(res => setCohorts(res.data))
      .catch(() => setError('Failed to load cohorts'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { reload() }, [reload])

  return { cohorts, loading, error, reload }
}
