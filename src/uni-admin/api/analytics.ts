import apiClient from '../../api/apiClient'
import type {
  TenantSummary,
  TrendPoint,
  GradeDistribution,
  CohortBenchmark,
} from './types'

export const getTenantSummary = (universityId?: number) =>
  apiClient.get<TenantSummary>('/analytics/tenant/summary', { params: { universityId } })

export const getTenantTrends = (universityId?: number) =>
  apiClient.get<TrendPoint[]>('/analytics/tenant/trends', { params: { universityId } })

export const getGradeDistribution = (universityId?: number) =>
  apiClient.get<GradeDistribution[]>('/analytics/tenant/grade-distribution', { params: { universityId } })

export const getCohortBenchmark = (universityId?: number) =>
  apiClient.get<CohortBenchmark[]>('/analytics/tenant/cohort-benchmark', { params: { universityId } })
