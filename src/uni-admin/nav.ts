import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Home,
  Megaphone,
  Presentation,
  UserCheck,
  UserRound,
  Users,
} from 'lucide-react'
import type { NavItem, SidebarUser } from '../shared/layout/Sidebar'

export const UNI_ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard',     icon: Home,         path: '/uni-admin',                 end: true },
  { label: 'Programmes',    icon: BookOpen,      path: '/uni-admin/programmes' },
  { label: 'Cohorts',       icon: Users,         path: '/uni-admin/cohorts' },
  { label: 'Lecturers',     icon: Presentation,  path: '/uni-admin/lecturers' },
  { label: 'Students',      icon: GraduationCap, path: '/uni-admin/students' },
  { label: 'Timetable',     icon: CalendarDays,  path: '/uni-admin/timetable' },
  { label: 'Attendance',    icon: UserCheck,     path: '/uni-admin/attendance' },
  { label: 'Announcements', icon: Megaphone,     path: '/uni-admin/announcements' },
  { label: 'Compliance',    icon: ClipboardList, path: '/uni-admin/compliance' },
  { label: 'Analytics',     icon: BarChart3,     path: '/uni-admin/analytics' },
  { label: 'Profile',       icon: UserRound,     path: '/uni-admin/profile' },
]

// TODO: Replace later with login user details..
export const UNI_ADMIN_USER: SidebarUser = {
  name: 'Avi Doorga',
  role: 'UNI ADMIN',
  institution: 'EPITA',
}
