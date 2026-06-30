import { Bell, BookOpen, Home, Star, UserRound, Users } from 'lucide-react'
import type { NavItem } from '../shared/layout/Sidebar'

export function getStudentNav(unreadCount = 0): NavItem[] {
  return [
    { label: 'Dashboard',     icon: Home,      path: '/student',               end: true },
    { label: 'Assignments',   icon: BookOpen,  path: '/student/assignments' },
    { label: 'Grades',        icon: Star,      path: '/student/grades' },
    {
      label: 'Notifications',
      icon:  Bell,
      path:  '/student/notifications',
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { label: 'My Cohort',  icon: Users,     path: '/student/cohort' },
    { label: 'Profile',    icon: UserRound, path: '/student/profile' },
  ]
}

export const STUDENT_NAV = getStudentNav()
