import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const menuItems = [
  {
    icon: '👤',
    title: 'Mi perfil',
    desc: 'Actualiza tu nombre, correo y datos personales',
    href: '/profile',
  },
  {
    icon: '🔔',
    title: 'Notificaciones',
    desc: 'Revisa tus alertas y mensajes recientes',
    href: '#',
  },
  {
    icon: '⚙️',
    title: 'Configuración',
    desc: 'Personaliza las preferencias de tu cuenta',
    href: '#',
  },
]

export default function Dashboard() {
  const { user } = useAuth()

  // Nombre abreviado para el saludo
  const firstName = user?.name?.split(' ')[0] || 'Usuario'

  // Formatear fecha de creación si existe
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('es-MX', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    : 'Hoy'

  return (
    <div className="dashboard-wrapper">
      <Navbar />

      <main className="dashboard-content">
        {/* Saludo */}
        <section className="welcome-section">
          <p className="welcome-tag">⚡ Panel principal</p>
          <h1 className="welcome-title">
            Hola, <span>{firstName}</span>
          </h1>
          <p className="welcome-subtitle">
            Bienvenido de vuelta. ¿Qué quieres hacer hoy?
          </p>
        </section>

        {/* Menú de acciones */}
        <div className="menu-grid">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className="menu-card"
            >
              <div className="menu-card-icon">{item.icon}</div>
              <div className="menu-card-title">{item.title}</div>
              <div className="menu-card-desc">{item.desc}</div>
            </Link>
          ))}
        </div>

        {/* Info de cuenta */}
        <div className="info-section">
          <div className="info-section-title">Información de la sesión</div>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Nombre</span>
              <span className="info-value">{user?.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Correo</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">ID de usuario</span>
              <span className="info-value" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>
                #{user?.id}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Miembro desde</span>
              <span className="info-value">{memberSince}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
