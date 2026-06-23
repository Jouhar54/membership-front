import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/services'
import { tokenStore } from '../api/client'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // ── Restore session on mount ─────────────────────────────────────────────
  // We verify with /auth/me rather than blindly trusting localStorage,
  // which also lets the refresh-token interceptor silently renew if needed.
  useEffect(() => {
    const token = tokenStore.get()
    if (!token) {
      setLoading(false)
      return
    }

    authApi
      .getMe()
      .then((userData) => setUser(userData))
      .catch(() => {
        // Token expired / invalid and refresh also failed → clear everything
        tokenStore.clear()
        localStorage.removeItem('aalia_user')
      })
      .finally(() => setLoading(false))
  }, [])

  // ── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(
    async (credentials) => {
      try {
        const { user: userData, accessToken } = await authApi.login(credentials)
        tokenStore.set(accessToken)
        // Cache a lightweight copy so the avatar / name renders instantly on next load
        localStorage.setItem('aalia_user', JSON.stringify(userData))
        setUser(userData)
        toast.success(`Welcome back, ${userData.fullName}!`)

        if (userData.role === 'admin' || userData.role === 'batch_admin') {
          navigate('/admin/dashboard')
        } else {
          navigate('/dashboard')
        }
        return userData
      } catch (error) {
        const msg =
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Login failed. Please check your credentials.'
        toast.error(msg)
        throw error
      }
    },
    [navigate],
  )

  // ── Register ─────────────────────────────────────────────────────────────
  const register = useCallback(
    async (data) => {
      try {
        const { user: userData, accessToken } = await authApi.register(data)
        tokenStore.set(accessToken)
        localStorage.setItem('aalia_user', JSON.stringify(userData))
        setUser(userData)
        toast.success('Registration successful! Welcome to AALIA.')
        navigate('/dashboard')
        return userData
      } catch (error) {
        const msg =
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Registration failed. Please try again.'
        toast.error(msg)
        throw error
      }
    },
    [navigate],
  )

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await authApi.logout() // clears the httpOnly refreshToken cookie server-side
    } catch {
      // Ignore errors — we clear local state regardless
    }
    tokenStore.clear()
    localStorage.removeItem('aalia_user')
    setUser(null)
    navigate('/login')
    toast.success('Logged out successfully')
  }, [navigate])

  // ── Refresh user profile (call after profile update) ─────────────────────
  const refreshUser = useCallback(async () => {
    try {
      const userData = await authApi.getMe()
      localStorage.setItem('aalia_user', JSON.stringify(userData))
      setUser(userData)
      return userData
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }, [])

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
        refreshUser,
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
