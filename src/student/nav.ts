import { Bell, BookOpen, GraduationCap, Home, Star, UserRound, Users } from 'lucide-react'
import type { NavItem } from '../shared/layout/Sidebar'

export const STUDENT_NAV: NavItem[] = [
  { label: 'Dashboard',     icon: Home,          path: '/student',               end: true },
  { label: 'Assignments',   icon: BookOpen,      path: '/student/assignments' },
  { label: 'Grades',        icon: Star,          path: '/student/grades' },
  { label: 'Notifications', icon: Bell,          path: '/student/notifications' },
  { label: 'My Cohort',     icon: Users,         path: '/student/cohort' },
  { label: 'Profile',       icon: UserRound,     path: '/student/profile' },
]
