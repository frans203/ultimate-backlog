import { NavLink, useNavigate } from 'react-router-dom'
import { useCrt } from '@/shared/hooks/use-crt'
import { useSound } from '@/shared/hooks/use-sound'
import { supabase } from '@/shared/lib/supabase'

const navItems = [
  {
    to: '/',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    to: '/backlog',
    label: 'Backlog',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 6h16M4 12h16M4 18h16" />
        <circle cx="4" cy="6" r="1" fill="currentColor" />
        <circle cx="4" cy="12" r="1" fill="currentColor" />
        <circle cx="4" cy="18" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    to: '/search',
    label: 'Buscar',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: 'Perfil',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
]

export function Sidebar() {
  const { crtEnabled, toggleCrt } = useCrt()
  const { playTabClick, playClick } = useSound()
  const navigate = useNavigate()

  const handleLogout = async () => {
    playClick()
    await supabase.auth.signOut()
    navigate('/auth')
  }

  return (
    <aside id="sidebar">
      {/* Logo */}
      <div className="w-full pl-[14px] mb-8 flex items-center gap-3 h-10">
        <div
          className="text-xl font-bold flex-shrink-0 logo-glitch"
          data-text="UB"
          style={{ fontFamily: "'Deltha'", color: 'var(--neon-red)' }}
        >
          UB
        </div>
        <div
          className="logo-text text-xs tracking-widest text-white logo-glitch"
          data-text="ULTIMATE BACKLOG"
          style={{ fontFamily: "'Deltha'" }}
        >
          ULTIMATE
          <br />
          BACKLOG
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col w-full flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => playTabClick()}
          >
            {item.icon}
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* CRT Toggle */}
      <button
        className="nav-item mt-auto"
        onClick={toggleCrt}
        style={{ opacity: 0.6, color: crtEnabled ? 'var(--neon-green)' : 'var(--text-muted)' }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="20" height="14" rx="1" />
          <path d="M8 21h8M12 17v4" />
          <path d="M5 7h14" strokeDasharray="2 2" opacity="0.5" />
          <path d="M5 10h14" strokeDasharray="2 2" opacity="0.5" />
          <path d="M5 13h14" strokeDasharray="2 2" opacity="0.5" />
        </svg>
        <span className="nav-label">CRT</span>
      </button>

      {/* Logout */}
      <button
        className="nav-item"
        onClick={handleLogout}
        style={{ color: 'var(--neon-red)', opacity: 0.6 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
        </svg>
        <span className="nav-label">Sair</span>
      </button>
    </aside>
  )
}
