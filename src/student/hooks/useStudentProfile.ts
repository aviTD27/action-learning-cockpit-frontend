import { useEffect, useState } from 'react'
import { getMyProfile, type StudentProfile } from '../api/studentApi'

export function useStudentProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getMyProfile()
      .then(setProfile)
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false))
  }, [])

  return { profile, loading, error }
}
