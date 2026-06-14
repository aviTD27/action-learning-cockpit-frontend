import { NavLink, useNavigate } from 'react-router-dom'
import { GraduationCap, Landmark, LogOut, Monitor, Presentation } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '../../auth/AuthContext'
import '../styles/layout.css'

export interface NavItem {
  label: string
  icon: LucideIcon
  path: string
  end?: boolean
}

export interface SidebarUser {
  name: string
  role: string
  institution?: string
}

const ROLE_NAV: NavItem[] = [
  { label: 'Platform Admin', icon: Monitor, path: '/platform-admin' },
  { label: 'Uni Admin', icon: Landmark, path: '/uni-admin' },
  { label: 'Lecturer', icon: Presentation, path: '/lecturer' },
  { label: 'Student', icon: GraduationCap, path: '/student' },
]

interface Props {
  items?: NavItem[]
  user?: SidebarUser
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function formatRoleLabel(role: string | null): string {
  if (!role) return ''
  return role.replace(/^ROLE_/, '').replace(/_/g, ' ')
}

export default function Sidebar({ items, user }: Props) {
  const nav = items ?? ROLE_NAV
  const { logout, displayName, role: authRole } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-title">
          <GraduationCap size={18} /> ALC
        </div>
        <div className="sidebar-logo-sub">Action Learning Cockpit</div>
      </div>

      {displayName && (
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials(displayName)}</div>
          <p className="sidebar-user-name">{displayName}</p>
          {user?.institution && (
            <p className="sidebar-user-institution">{user.institution}</p>
          )}
          <span className="sidebar-badge">{formatRoleLabel(authRole)}</span>
        </div>
      )}

      <nav className="sidebar-nav">
        {nav.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            <item.icon size={14} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {items && (
          <>
            <p className="sidebar-footer-label">Switch role</p>
            {ROLE_NAV.map(r => (
              <NavLink key={r.path} to={r.path} className="nav-link">
                <r.icon size={14} />
                {r.label}
              </NavLink>
            ))}
          </>
        )}
        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={14} /> Log out
        </button>
      </div>
    </aside>
  )
}
