import { useEffect, useState } from 'react'
import { getMyProfile, getAssignmentsForCohort, type AssignmentItem } from '../api/studentApi'

export type AssignmentStatus = 'pending' | 'past-due'

export interface Assignment extends AssignmentItem {
  status: AssignmentStatus
}

function computeStatus(dueDate: string): AssignmentStatus {
  const due = new Date(dueDate)
  due.setHours(23, 59, 59, 999)
  return due < new Date() ? 'past-due' : 'pending'
}

export function useStudentAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const profile = await getMyProfile()
        if (!profile.cohortId) { setLoading(false); return }
        const items = await getAssignmentsForCohort(profile.cohortId)
        const mapped: Assignment[] = items
          .map(a => ({ ...a, status: computeStatus(a.dueDate) }))
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        setAssignments(mapped)
      } catch {
        setError('Failed to load assignments.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { assignments, loading, error }
}
