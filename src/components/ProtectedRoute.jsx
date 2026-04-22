import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()

  // Si no está autenticado, redirigir al login
  // 'replace' evita que la ruta protegida quede en el historial
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
