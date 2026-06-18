import { Home, ClipboardList, Users } from 'lucide-react'
import type { NavItem } from '../shared/layout/Sidebar'

export const SUPER_ADMIN_NAV: NavItem[] = [
  { label: 'Overview',        icon: Home,          path: '/super-admin',                end: true },
  { label: 'Registrations',   icon: ClipboardList, path: '/super-admin/registrations' },
  { label: 'Platform Admins', icon: Users,         path: '/super-admin/platform-admins' },
]
