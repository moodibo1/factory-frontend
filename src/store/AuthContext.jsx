import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { apiRequest } from '@/services/api'

// Constants
const SESSION_TIMEOUT = 30 * 60 * 1000
const LAST_ACTIVITY_KEY = 'lastActivity'
const SESSION_CHECK_INTERVAL = 60000
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']

// Storage keys
const STORAGE_KEYS = {
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

  // Load user profile from backend using Supabase session
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
    if (!supabase) throw new Error('Supabase is not configured.')

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)

    if (rememberMe) {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true')
      localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY)
    } else {
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME)
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString())
    }

    const profile = await loadUserProfile()

    // Check admin approval gate
    if (profile?.status === 'pending') {
      await supabase.auth.signOut()
      clearSession()
      throw new Error('PENDING')
    }
    if (profile?.status === 'rejected') {
      await supabase.auth.signOut()
      clearSession()
      throw new Error('REJECTED')
    }

    return profile
  }, [loadUserProfile, clearSession])

  const register = useCallback(async (name, email, password) => {
    if (!supabase) throw new Error('Supabase is not configured.')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    console.log('Supabase signUp response:', { data, error })
    if (error) throw new Error(error.message)
  }, [])

  const forgotPassword = useCallback(async (email) => {
    if (!supabase) throw new Error('Supabase is not configured.')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw new Error(error.message)
  }, [])

  const logout = useCallback(async () => {
    if (supabase) await supabase.auth.signOut()
    clearSession()
    notifyAdminStatus(null)
  }, [clearSession, notifyAdminStatus])

  // Bootstrap: restore session from Supabase on mount
  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        clearSession()
        setLoading(false)
        return
      }
      if (!isSessionValid()) {
        await supabase.auth.signOut()
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
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        clearSession()
      }
    })

    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEYS.USER) {
        const newUser = localStorage.getItem(STORAGE_KEYS.USER)
        if (!newUser) {
          clearSession()
          window.location.href = '/login'
        } else {
          try {
            const parsed = JSON.parse(newUser)
            setUser(parsed)
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
      subscription.unsubscribe()
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
