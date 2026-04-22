import { useState } from 'react'
//import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate, Navigate } from 'react-router-dom'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  /* Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    navigate('/dashboard', { replace: true })
    return null
  }*/

    if (isAuthenticated) {
  return <Navigate to="/dashboard" replace />
}

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validación básica
    if (!form.email || !form.password) {
      setError('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    try {
      login(form.email, form.password)
      navigate('/dashboard')
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
          <h1 className="card-title">Bienvenido de nuevo</h1>
          <p className="card-subtitle">Inicia sesión para continuar</p>
        </div>

        {/* Formulario */}
        <form className="form" onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error">
              ⚠️ {error}
            </div>
          )}

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
              autoFocus
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
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión →'}
          </button>
        </form>

        {/* Footer */}
        <p className="form-footer">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-link">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  )
}
