import { Bell } from 'lucide-react'
import '../styles/layout.css'

interface Props {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: Props) {
  return (
    <header className="header">
      <p className="header-title">{title}</p>
      <div className="header-right">
        {subtitle && (
          <p className="header-subtitle">{subtitle}</p>
        )}
        <button className="header-bell">
          <Bell size={18} />
          <span className="header-bell-dot" />
        </button>
      </div>
    </header>
  )
}