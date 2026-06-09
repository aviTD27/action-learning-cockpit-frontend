import { useEffect, useState } from 'react'

export type StudentStatus = 'active' | 'at_risk' | 'inactive'

export interface Student {
  id:         string
  name:       string
  cohortName: string
  status:     StudentStatus
}

const MOCK: Student[] = [
  { id:'1', name:'Jane Doe', cohortName:'MSc-2025-Fall',  status:'active' },
  { id:'2', name:'Jane Smith', cohortName:'MSc-2025-Fall', status:'at_risk' },
  { id:'3', name:'John Smith', cohortName:'MSc-2025-Fall', status:'active' },
  { id:'4', name:'Alex Johnson', cohortName:'MSc-2025-Fall',  status:'active' },
  { id:'5', name:'Jim Brown', cohortName:'MSc-2025-Fall', status:'inactive' },
]

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading,  setLoading ] = useState(true)

  useEffect(() => {
    setTimeout(() => { setStudents(MOCK); setLoading(false) }, 400)
  }, [])

  return { students, loading }
}