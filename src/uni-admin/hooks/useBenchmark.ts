import { useCohortBenchmark } from './useAnalytics'
import type { CohortBenchmark } from '../api/types'

export type BenchmarkRow = CohortBenchmark

export function useBenchmark() {
  const { benchmark, loading } = useCohortBenchmark()
  return { benchmark, loading }
}
