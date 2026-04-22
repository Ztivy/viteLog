import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Obtener iniciales del nombre para el avatar
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <nav className="navbar">
      {/* Marca / Logo */}
      <NavLink to="/dashboard" className="navbar-brand">
        ⚡ ViteApp
      </NavLink>

      {/* Navegación principal */}
      <div className="navbar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          🏠 Inicio
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          👤 Perfil
        </NavLink>
      </div>

      {/* Usuario + logout */}
      <div className="navbar-user">
        <div className="user-avatar" title={user?.name}>
          {initials}
        </div>
        <button className="btn btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }} onClick={handleLogout}>
          Salir
        </button>
      </div>
    </nav>
  )
}
