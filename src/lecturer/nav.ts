import { Bell, CalendarDays, CheckCheck, ClipboardList, Home, ScrollText, UserRound } from 'lucide-react'
import type { NavItem, SidebarUser } from '../shared/layout/Sidebar'

export const LECTURER_NAV: NavItem[] = [
  { label: 'Dashboard', icon: Home, path: '/lecturer', end: true },
  { label: 'Timetable',   icon: CalendarDays,  path: '/lecturer/timetable' },
  { label: 'Submissions', icon: ClipboardList, path: '/lecturer/submissions' },
  { label: 'Submission Rules', icon: ScrollText, path: '/lecturer/rules' },
  { label: 'Notify Students', icon: Bell, path: '/lecturer/notify' },
  { label: 'Grade Review', icon: CheckCheck, path: '/lecturer/grade-review' },
  { label: 'Profile', icon: UserRound, path: '/lecturer/profile' },
]

export const LECTURER_USER: SidebarUser = {
  name: 'Dr. Jane Smith',
  role: 'LECTURER',
  institution: 'EPITA',
}

export const CURRENT_LECTURER_ID = 1
