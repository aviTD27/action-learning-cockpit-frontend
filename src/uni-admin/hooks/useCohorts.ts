import { useEffect, useState } from 'react'

export type CohortStatus = 'open' | 'closed' | 'late' | 'not_started'

export interface Cohort {
  id:           string
  name:         string
  programme:    string
  lecturerName: string
  studentCount: number
  currentCycle: number
  totalCycles:  number
  status:       CohortStatus
}

const MOCK: Cohort[] = [
  { id:'1', name:'MSc-2025-Spring',  programme:'MSc Software Eng', lecturerName:'Dr. Tom', studentCount:30, currentCycle:3, totalCycles:4, status:'open'},
  { id:'2', name:'MSc-2025-Spring',  programme:'MSc AIS', lecturerName:'Dr. John ',   studentCount:35, currentCycle:3, totalCycles:4, status:'open'},
  { id:'3', name:'MSc-2025-Spring',  programme:'MSc Cyber Security', lecturerName:'Dr. Rose', studentCount:20, currentCycle:2, totalCycles:4, status:'open'},
  { id:'4', name:'MSc-2025-Fall',  programme:'MSc Software Eng', lecturerName:'Dr. Tom',   studentCount:30, currentCycle:3, totalCycles:4, status:'late'},
  { id:'5', name:'MSc-2025-Fall', programme:'MSc Data Science', lecturerName:'Dr. Alice',  studentCount:25, currentCycle:4, totalCycles:4, status:'closed'},
  { id:'6', name:'MSc-2025-Fall',  programme:'MSc AIMS', lecturerName:'Dr. Rose',  studentCount:20, currentCycle:1, totalCycles:4, status:'not_started'},
]

export function useCohorts() {
  const [cohorts, setCohorts] = useState<Cohort[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    setCohorts(MOCK)
    setLoading(false)
  }

  useEffect(() => { load() }, [])
  return { cohorts, loading, refetch: load }
}