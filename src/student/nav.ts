import { GraduationCap, Home, ClipboardList, UserRound } from 'lucide-react'
import type { NavItem } from '../shared/layout/Sidebar'

export const STUDENT_NAV: NavItem[] = [
  { label: 'Dashboard',   icon: Home,          path: '/student', end: true },
  { label: 'Submissions', icon: ClipboardList, path: '/student/submissions' },
  { label: 'Profile',     icon: UserRound,     path: '/student/profile' },
]
