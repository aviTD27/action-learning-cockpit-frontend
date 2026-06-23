import { useCallback, useEffect, useState } from 'react'
import { getCohorts } from '../api/uniAdmin'
import { useAuth } from '../../auth/AuthContext'
import type { CohortResponse } from '../api/types'

export function useCohorts() {
  const { universityId } = useAuth()
  const [cohorts, setCohorts] = useState<CohortResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    getCohorts(universityId ?? undefined)
      .then(res => setCohorts(res.data))
      .catch(() => setError('Failed to load cohorts'))
      .finally(() => setLoading(false))
  }, [universityId])

  useEffect(() => { reload() }, [reload])

  return { cohorts, loading, error, reload }
}
