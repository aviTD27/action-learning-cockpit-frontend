import { useCallback, useEffect, useState } from 'react'
import { getProgrammes } from '../api/uniAdmin'
import { CURRENT_UNIVERSITY_ID } from '../tenant'
import type { ProgrammeResponse } from '../api/types'

export function useProgrammes() {
  const [programmes, setProgrammes] = useState<ProgrammeResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    getProgrammes(CURRENT_UNIVERSITY_ID)
      .then(res => setProgrammes(res.data))
      .catch(() => setError('Failed to load programmes'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { reload() }, [reload])

  return { programmes, loading, error, reload }
}
