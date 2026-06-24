import { useEffect, useState } from 'react'
import { getCohorts, getLecturers, getProgrammes, getStudents } from '../api/uniAdmin'
import { useAuth } from '../../auth/AuthContext'

export interface UniAdminStats {
  totalProgrammes: number
  totalCohorts: number
  activeCohorts: number
  totalLecturers: number
  activeLecturers: number
  totalStudents: number
  activeStudents: number
  checkpointPassRate: number
  avgNlpScore: number
}

export function useUniAdminStats() {
  const { universityId } = useAuth()
  const [stats, setStats] = useState<UniAdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      getProgrammes(universityId ?? undefined),
      getCohorts(universityId ?? undefined),
      getLecturers(universityId ?? undefined),
      getStudents(universityId ?? undefined),
    ])
      .then(([prog, coh, lec, stu]) => {
        setStats({
          totalProgrammes: prog.data.length,
          totalCohorts: coh.data.length,
          activeCohorts: coh.data.filter(c => c.status === 'ONGOING').length,
          totalLecturers: lec.data.length,
          activeLecturers: lec.data.filter(l => l.status === 'ACTIVE').length,
          totalStudents: stu.data.length,
          activeStudents: stu.data.filter(s => s.status === 'ACTIVE').length,
          checkpointPassRate: 87, // TODO: backend
          avgNlpScore: 72,        // TODO: backend
        })
      })
      .catch(() => setError('Failed to load stats'))
      .finally(() => setLoading(false))
  }, [])

  return { stats, loading, error }
}
