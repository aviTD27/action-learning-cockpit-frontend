import { useEffect, useState } from 'react'

export interface BenchmarkRow {
  institutionName: string
  isOwn: boolean
  studentCount: number
  gatePassRate: number
  avgNlpScore: number
  onTimeRate: number
  rank: number
}

const MOCK: BenchmarkRow[] = [
  { institutionName:'EPITA',isOwn:true,  studentCount:350, gatePassRate:82, avgNlpScore:73, onTimeRate:87, rank:1 },
  { institutionName:'EPITECH', isOwn:false, studentCount:250, gatePassRate:75, avgNlpScore:68, onTimeRate:80, rank:2 },
  { institutionName:'University Sorbonne', isOwn:false, studentCount:500, gatePassRate:68, avgNlpScore:64, onTimeRate:74, rank:3 },
  { institutionName:'Paris Saclay', isOwn:false, studentCount:450, gatePassRate:61, avgNlpScore:60, onTimeRate:69, rank:4 },
]

export function useBenchmark() {
  const [benchmark, setBenchmark] = useState<BenchmarkRow[]>([])
  const [loading,   setLoading  ] = useState(true)

  useEffect(() => {
    setTimeout(() => { setBenchmark(MOCK); setLoading(false) }, 400)
  }, [])

  return { benchmark, loading }
}