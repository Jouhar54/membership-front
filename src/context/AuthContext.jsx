import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/services'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('aalia_token')
    const savedUser = localStorage.getItem('aalia_user')
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('aalia_token')
        localStorage.removeItem('aalia_user')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (credentials) => {
    try {
      const { user: userData, token, refreshToken } = await authApi.login(credentials)
      localStorage.setItem('aalia_token', token)
      localStorage.setItem('aalia_refresh_token', refreshToken)
      localStorage.setItem('aalia_user', JSON.stringify(userData))
      setUser(userData)
      toast.success(`Welcome back, ${userData.fullName}!`)

      // Redirect based on role
      if (userData.role === 'admin' || userData.role === 'batch_admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/dashboard')
      }
      return userData
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      throw error
    }
  }, [navigate])

  const register = useCallback(async (data) => {
    try {
      const { user: userData, token, refreshToken } = await authApi.register(data)
      localStorage.setItem('aalia_token', token)
      localStorage.setItem('aalia_refresh_token', refreshToken)
      localStorage.setItem('aalia_user', JSON.stringify(userData))
      setUser(userData)
      toast.success('Registration successful!')
      navigate('/dashboard')
      return userData
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
      throw error
    }
  }, [navigate])

  const logout = useCallback(() => {
    localStorage.removeItem('aalia_token')
    localStorage.removeItem('aalia_refresh_token')
    localStorage.removeItem('aalia_user')
    setUser(null)
    navigate('/login')
    toast.success('Logged out successfully')
  }, [navigate])

  const isAdmin = user?.role === 'admin'
  const isBatchAdmin = user?.role === 'batch_admin'
  const isMember = user?.role === 'member'
  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isBatchAdmin,
        isMember,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
