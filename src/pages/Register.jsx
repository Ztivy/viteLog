import { useState } from 'react'
//import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate, Navigate } from 'react-router-dom'

export default function Register() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  /*if (isAuthenticated) {
    navigate('/dashboard', { replace: true })
    return null
  }*/

    if (isAuthenticated) {
  return <Navigate to="/dashboard" replace />
}

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Validaciones
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Por favor completa todos los campos')
      return
    }
    if (form.name.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    try {
      register(form.name.trim(), form.email, form.password)
      setSuccess('¡Cuenta creada exitosamente! Redirigiendo al login...')
      setTimeout(() => navigate('/login'), 1800)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrapper">
      <div className="card">
        {/* Encabezado */}
        <div className="card-header">
          <div className="card-logo">ViteApp</div>
          <h1 className="card-title">Crear cuenta</h1>
          <p className="card-subtitle">Únete en segundos, es gratis</p>
        </div>

        {/* Formulario */}
        <form className="form" onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error">⚠️ {error}</div>
          )}
          {success && (
            <div className="alert alert-success">✓ {success}</div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Nombre completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-input"
              placeholder="Ana García"
              value={form.name}
              onChange={handleChange}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="tu@correo.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="form-input"
              placeholder="Repite tu contraseña"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !!success}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta →'}
          </button>
        </form>

        <p className="form-footer">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-link">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
