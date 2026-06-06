import { useEffect, useState } from 'react'

export interface UniAdminStats {
  totalStudents: number
  activeCohorts: number
  totalLecturers: number
  checkpointPassRate: number
  avgNlpScore: number
}

const MOCK_STATS: UniAdminStats = {
  totalStudents: 350,
  activeCohorts: 10,
  totalLecturers: 25,
  checkpointPassRate: 82,
  avgNlpScore: 73,
}

export function useUniAdminStats() {
  const [stats, setStats] = useState<UniAdminStats | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats(MOCK_STATS)
      setLoading(false)
    }, 400)

    return () => clearTimeout(timer)
  }, [])

  return { stats, loading }
}
