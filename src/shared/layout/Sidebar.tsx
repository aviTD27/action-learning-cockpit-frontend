import { NavLink } from 'react-router-dom'
import '../styles/layout.css'

const NAV = [
  { label: 'Platform Admin',  icon: '🖥️', path: '/platform-admin' },
  { label: 'Uni Admin',       icon: '🏛️', path: '/uni-admin'      },
  { label: 'Teacher',         icon: '👩‍🏫', path: '/teacher'        },
  { label: 'Student',         icon: '🎓', path: '/student'         },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">🎓 ALC</div>
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
    </aside>
  )
}