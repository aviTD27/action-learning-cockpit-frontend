import { NavLink } from 'react-router-dom'
import { LogOut }  from 'lucide-react'
import '../styles/layout.css'

const NAV = [
  { label: 'Overview',          icon: '🏠',  path: '/university/dashboard'  },
  { label: 'Cohort Management', icon: '👥',  path: '/university/cohorts'    },
  { label: 'Lecturers',         icon: '👩‍🏫', path: '/university/lecturers'  },
  { label: 'Students',          icon: '🎓',  path: '/university/students'   },
  { label: 'Compliance',        icon: '📋',  path: '/university/compliance' },
  { label: 'Analytics',         icon: '📊',  path: '/university/analytics'  },
  { label: 'Settings',          icon: '⚙️',  path: '/university/settings'   },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <p className="sidebar-logo-title">🎓 ALC</p>
        <p className="sidebar-logo-sub">Action Learning Cockpit</p>
      </div>

      <div className="sidebar-user">
        <div className="sidebar-avatar">TD</div>
        <p className="sidebar-user-name">Avi Doorga</p>
        <p className="sidebar-user-institution">EPITA</p>
        <span className="sidebar-badge">UNI ADMIN</span>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout">
          <LogOut size={13} />
          Logout
        </button>
      </div>

    </aside>
  )
}