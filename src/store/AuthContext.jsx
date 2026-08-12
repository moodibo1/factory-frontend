import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { authService, apiRequest } from '@/services/api'

// Constants
const SESSION_TIMEOUT = 30 * 60 * 1000
const LAST_ACTIVITY_KEY = 'lastActivity'
const SESSION_CHECK_INTERVAL = 60000
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  REMEMBER_ME: 'rememberMe',
  LAST_ACTIVITY: LAST_ACTIVITY_KEY,
}

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const isSessionValid = useCallback(() => {
    const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true'
    if (rememberMe) return true
    const lastActivity = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY)
    if (!lastActivity) return false
    return Date.now() - parseInt(lastActivity, 10) < SESSION_TIMEOUT
  }, [])

  const updateActivity = useCallback(() => {
    const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true'
    if (!rememberMe) {
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString())
    }
  }, [])

  const clearSession = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
    setUser(null)
  }, [])

  const notifyAdminStatus = useCallback((role) => {
    if (window.setAdminStatus) window.setAdminStatus(role === 'admin')
  }, [])

  const checkSessionAndRedirect = useCallback(() => {
    const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true'
    if (!isSessionValid() && !rememberMe) {
      clearSession()
      window.location.href = '/login'
    }
  }, [isSessionValid, clearSession])

  const loadUserProfile = useCallback(async () => {
    try {
      const profile = await apiRequest('/auth/me')
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile))
      setUser(profile)
      notifyAdminStatus(profile.role)
      return profile
    } catch {
      clearSession()
      return null
    }
  }, [clearSession, notifyAdminStatus])

  const login = useCallback(async (email, password, rememberMe = false) => {
    const data = await authService.login(email, password)
    localStorage.setItem(STORAGE_KEYS.TOKEN, data.access_token)

    if (rememberMe) {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true')
      localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY)
    } else {
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME)
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString())
    }

    const profile = await loadUserProfile()
    return profile
  }, [loadUserProfile])

  const register = useCallback(async (name, email, password) => {
    await authService.register(name, email, password)
  }, [])

  const forgotPassword = useCallback(async (email) => {
    if (!supabase) throw new Error('Supabase is not configured.')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw new Error(error.message)
  }, [])

  const logout = useCallback(() => {
    clearSession()
    notifyAdminStatus(null)
  }, [clearSession, notifyAdminStatus])

  // Bootstrap on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
      if (!token || !isSessionValid()) {
        clearSession()
        setLoading(false)
        return
      }

      const storedUser = localStorage.getItem(STORAGE_KEYS.USER)
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser)
          setUser(parsed)
          updateActivity()
          notifyAdminStatus(parsed.role)
        } catch {
          await loadUserProfile()
        }
      } else {
        await loadUserProfile()
      }
      setLoading(false)
    }
    initAuth()

    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEYS.TOKEN || e.key === STORAGE_KEYS.USER) {
        const newToken = localStorage.getItem(STORAGE_KEYS.TOKEN)
        const newUser = localStorage.getItem(STORAGE_KEYS.USER)
        if (!newToken) {
          clearSession()
          window.location.href = '/login'
        } else if (newUser) {
          try {
            const parsed = JSON.parse(newUser)
            setUser(parsed)
            updateActivity()
            notifyAdminStatus(parsed.role)
          } catch { /* ignore */ }
        }
      }
    }

    const handleActivity = () => updateActivity()
    window.addEventListener('storage', handleStorageChange)
    ACTIVITY_EVENTS.forEach(event => document.addEventListener(event, handleActivity, { passive: true }))
    const sessionCheckInterval = setInterval(checkSessionAndRedirect, SESSION_CHECK_INTERVAL)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      ACTIVITY_EVENTS.forEach(event => document.removeEventListener(event, handleActivity))
      clearInterval(sessionCheckInterval)
    }
  }, [isSessionValid, updateActivity, clearSession, notifyAdminStatus, checkSessionAndRedirect, loadUserProfile])

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      forgotPassword,
      logout,
      isAuthenticated: !!user,
    }),
    [user, loading, login, register, forgotPassword, logout]
  )

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { SESSION_TIMEOUT, LAST_ACTIVITY_KEY, STORAGE_KEYS }
