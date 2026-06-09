import { useEffect, useState } from 'react'

export interface Lecturer {
  id:      string
  name:    string
  cohorts: string[]
  role:    string
}

const MOCK: Lecturer[] = [
  { id:'1', name:'Dr. Tom', cohorts:['MSc-2024-Spring','MSc-2024-Fall'], role:'Lecturer' },
  { id:'2', name:'Dr. Rose',   cohorts:['MSc-2024-Fall'], role:'Lecturer' },
  { id:'3', name:'Dr. Tom', cohorts:['MSc-2024-Spring'], role:'Senior Lec.'  },
  { id:'4', name:'Dr. Alice',   cohorts:['MSc-2024-Spring'], role:'Lecturer' },
  { id:'5', name:'Dr. Rose',  cohorts:['MSc-2024-Fall'], role:'Prog. Coord.' },
]

export function useLecturers() {
  const [lecturers, setLecturers] = useState<Lecturer[]>([])
  const [loading,   setLoading  ] = useState(true)

  useEffect(() => {
    setTimeout(() => { setLecturers(MOCK); setLoading(false) }, 400)
  }, [])

  return { lecturers, loading }
}