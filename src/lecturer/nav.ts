import { CalendarDays, CheckCheck, ClipboardList, Home, Megaphone, UserRound } from 'lucide-react'
import type { NavItem, SidebarUser } from '../shared/layout/Sidebar'

export function getLecturerNav(announcementUnread = 0): NavItem[] {
  return [
    { label: 'Dashboard',   icon: Home,          path: '/lecturer',              end: true },
    { label: 'Timetable',   icon: CalendarDays,  path: '/lecturer/timetable' },
    { label: 'Submissions', icon: ClipboardList, path: '/lecturer/submissions' },
    { label: 'Grade Review', icon: CheckCheck,   path: '/lecturer/grade-review' },
    {
      label: 'Announcements',
      icon:  Megaphone,
      path:  '/lecturer/announcements',
      badge: announcementUnread > 0 ? announcementUnread : undefined,
    },
    { label: 'Profile', icon: UserRound, path: '/lecturer/profile' },
  ]
}

export const LECTURER_NAV = getLecturerNav()

export const LECTURER_USER: SidebarUser = {
  name: 'Dr. Jane Smith',
  role: 'LECTURER',
  institution: 'EPITA',
}

export const CURRENT_LECTURER_ID = 1
