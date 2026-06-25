import { useEffect, useState } from 'react'
import type { AxiosResponse } from 'axios'
import { useAuth } from '../../auth/AuthContext'
import {
  getCohortBenchmark,
  getGradeDistribution,
  getTenantSummary,
  getTenantTrends,
} from '../api/analytics'
import type { CohortBenchmark, GradeDistribution, TenantSummary, TrendPoint } from '../api/types'

function useEndpoint<T>(
  fetcher: (universityId?: number) => Promise<AxiosResponse<T>>,
  fallback: T,
) {
  const { universityId } = useAuth()
  const [data, setData] = useState<T>(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    setLoading(true)
    fetcher(universityId ?? undefined)
      .then(r => { if (alive) setData(r.data) })
      .catch(() => { if (alive) setError('Failed to load analytics') })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [universityId, fetcher])

  return { data, loading, error }
}

export function useTenantSummary() {
  const { data, loading, error } = useEndpoint<TenantSummary | null>(getTenantSummary, null)
  return { summary: data, loading, error }
}

export function useTenantTrends() {
  const { data, loading, error } = useEndpoint<TrendPoint[]>(getTenantTrends, [])
  return { trends: data, loading, error }
}

export function useGradeDistribution() {
  const { data, loading, error } = useEndpoint<GradeDistribution[]>(getGradeDistribution, [])
  return { distribution: data, loading, error }
}

export function useCohortBenchmark() {
  const { data, loading, error } = useEndpoint<CohortBenchmark[]>(getCohortBenchmark, [])
  return { benchmark: data, loading, error }
}

export function useAnalytics() {
  const s = useTenantSummary()
  const t = useTenantTrends()
  const d = useGradeDistribution()
  const b = useCohortBenchmark()
  return {
    summary: s.summary,
    trends: t.trends,
    distribution: d.distribution,
    benchmark: b.benchmark,
    loading: s.loading || t.loading || d.loading || b.loading,
    error: s.error ?? t.error ?? d.error ?? b.error,
  }
}
