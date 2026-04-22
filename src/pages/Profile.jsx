import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

export default function Profile() {
  const { user, updateProfile, logout } = useAuth()
  const navigate = useNavigate()

  // Inicializar formulario con datos actuales del usuario
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [status, setStatus]   = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  // Iniciales para el avatar
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setStatus({ type: '', message: '' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus({ type: '', message: '' })

    // Validaciones
    if (!form.name.trim() || !form.email.trim()) {
      setStatus({ type: 'error', message: 'El nombre y correo son obligatorios' })
      return
    }
    if (form.name.trim().length < 2) {
      setStatus({ type: 'error', message: 'El nombre debe tener al menos 2 caracteres' })
      return
    }

    // Validar cambio de contraseña (opcional)
    if (form.newPassword || form.confirmPassword) {
      if (form.newPassword.length < 6) {
        setStatus({ type: 'error', message: 'La nueva contraseña debe tener al menos 6 caracteres' })
        return
      }
      if (form.newPassword !== form.confirmPassword) {
        setStatus({ type: 'error', message: 'Las contraseñas nuevas no coinciden' })
        return
      }
    }

    setLoading(true)
    try {
      const updateData = {
        name: form.name.trim(),
        email: form.email.trim(),
      }

      // Solo actualizar contraseña si se proporcionó una nueva
      if (form.newPassword) {
        updateData.password = form.newPassword
      }

      updateProfile(updateData)

      setStatus({ type: 'success', message: '✓ Perfil actualizado correctamente' })

      // Limpiar campos de contraseña
      setForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="dashboard-wrapper">
      <Navbar />

      <main className="dashboard-content">
        {/* Header con avatar */}
        <div className="profile-header" style={{ animation: 'fadeUp 0.4s ease' }}>
          <div className="profile-avatar-lg">{initials}</div>
          <div className="profile-info">
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </div>
        </div>

        {/* Formulario de edición */}
        <div className="profile-form-card" style={{ animation: 'fadeUp 0.4s 0.1s ease both' }}>
          <h3 className="section-title">Editar información personal</h3>

          <form className="form" onSubmit={handleSubmit}>
            {status.message && (
              <div className={`alert alert-${status.type}`}>
                {status.message}
              </div>
            )}

            {/* Datos personales */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="name">Nombre completo</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-input"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Correo electrónico</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@correo.com"
                />
              </div>
            </div>

            {/* Cambio de contraseña */}
            <div className="divider">cambiar contraseña (opcional)</div>

            <div className="form-group">
              <label className="form-label" htmlFor="newPassword">
                Nueva contraseña
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                className="form-input"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                Confirmar nueva contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="form-input"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repite la nueva contraseña"
                autoComplete="new-password"
              />
            </div>

            {/* Acciones */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? 'Guardando...' : '💾 Guardar cambios'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/dashboard')}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        {/* Zona de peligro */}
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1.5rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            animation: 'fadeUp 0.4s 0.2s ease both',
          }}
        >
          <h3 className="section-title" style={{ color: 'var(--error)' }}>
            Zona de peligro
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Al cerrar sesión, necesitarás tus credenciales para volver a ingresar.
          </p>
          <button className="btn btn-danger" onClick={handleLogout}>
            🚪 Cerrar sesión
          </button>
        </div>
      </main>
    </div>
  )
}
