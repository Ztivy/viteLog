import { createContext, useContext, useState, useEffect } from 'react'

// 1. Crear el contexto
const AuthContext = createContext(null)

// 2. Proveedor del contexto — envuelve toda la app en App.jsx
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Al montar, recuperar sesión desde localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('authUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  // Registrar un nuevo usuario
  const register = (name, email, password) => {
    // Verificar si el email ya está registrado
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const exists = users.find(u => u.email === email)
    if (exists) {
      throw new Error('Este correo ya está registrado')
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password, // En producción real: NUNCA guardar contraseña en texto plano
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    return newUser
  }

  // Iniciar sesión
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const found = users.find(u => u.email === email && u.password === password)

    if (!found) {
      throw new Error('Correo o contraseña incorrectos')
    }

    // Guardar sesión sin la contraseña
    const { password: _, ...safeUser } = found
    setUser(safeUser)
    localStorage.setItem('authUser', JSON.stringify(safeUser))
    return safeUser
  }

  // Cerrar sesión
  const logout = () => {
    setUser(null)
    localStorage.removeItem('authUser')
  }

  // Actualizar perfil del usuario
  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData }

    // Actualizar en la lista de usuarios registrados
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const updatedUsers = users.map(u =>
      u.id === user.id ? { ...u, ...updatedData } : u
    )
    localStorage.setItem('users', JSON.stringify(updatedUsers))

    // Actualizar sesión activa
    setUser(updatedUser)
    localStorage.setItem('authUser', JSON.stringify(updatedUser))
    return updatedUser
  }

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// 3. Hook personalizado para consumir el contexto fácilmente
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  }
  return context
}
