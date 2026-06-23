import { useCallback, useEffect, useState } from 'react'
import { getProgrammes } from '../api/uniAdmin'
import { useAuth } from '../../auth/AuthContext'
import type { ProgrammeResponse } from '../api/types'

export function useProgrammes() {
  const { universityId } = useAuth()
  const [programmes, setProgrammes] = useState<ProgrammeResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    getProgrammes(universityId ?? undefined)
      .then(res => setProgrammes(res.data))
      .catch(() => setError('Failed to load programmes'))
      .finally(() => setLoading(false))
  }, [universityId])

  useEffect(() => { reload() }, [reload])

  return { programmes, loading, error, reload }
}
