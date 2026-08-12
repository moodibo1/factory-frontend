import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { authService, apiRequest } from '@/services/api'
import { supabase } from '@/lib/supabaseClient'

// Constants
const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds
const LAST_ACTIVITY_KEY = 'lastActivity'
const SESSION_CHECK_INTERVAL = 60000 // Check every 1 minute
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  REMEMBER_ME: 'rememberMe',
  LAST_ACTIVITY: LAST_ACTIVITY_KEY,
}

const AuthContext = createContext(undefined)

/**
 * AuthProvider - Manages user authentication state and session management
 * 
 * Features:
 * - JWT token-based authentication
 * - Session timeout (30 minutes of inactivity)
 * - "Remember Me" functionality (no timeout)
 * - Cross-tab synchronization
 * - Activity tracking
 * - Auto-logout on session expiry
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // ==================== Session Management ====================

  /**
   * Check if current session is valid (not timed out)
   */
  const isSessionValid = useCallback(() => {
    const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true'
    if (rememberMe) return true // No timeout for "Remember Me"

    const lastActivity = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY)
    if (!lastActivity) return false

    const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10)
    return timeSinceLastActivity < SESSION_TIMEOUT
  }, [])

  /**
   * Update last activity timestamp (only for non-"Remember Me" sessions)
   */
  const updateActivity = useCallback(() => {
    const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true'
    if (!rememberMe) {
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString())
    }
  }, [])

  /**
   * Clear all session data from storage
   */
  const clearSession = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    setUser(null)
  }, [])

  /**
   * Check session and redirect to login if expired
   */
  const checkSessionAndRedirect = useCallback(() => {
    const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true'
    if (!isSessionValid() && !rememberMe) {
      clearSession()
      window.location.href = '/login'
    }
  }, [isSessionValid, clearSession])

  /**
   * Notify HTML-level security layer about admin status
   */
  const notifyAdminStatus = useCallback((role) => {
    if (window.setAdminStatus) {
      window.setAdminStatus(role === 'admin')
    }
  }, [])

  // ==================== Authentication Methods ====================

  /**
   * Login user with email and password
   */
  const login = useCallback(async (email, password, rememberMe = false) => {
    try {
      const data = await authService.login(email, password)
      localStorage.setItem(STORAGE_KEYS.TOKEN, data.access_token)

      if (rememberMe) {
        localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true')
        localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY)
      } else {
        localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME)
        localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString())
      }

      const profile = await apiRequest('/auth/me')
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile))
      setUser(profile)

      notifyAdminStatus(profile.role)

      return profile
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }, [notifyAdminStatus])

  /**
   * Register new user
   */
  const register = useCallback(async (name, email, password) => {
    try {
      return await authService.register(name, email, password)
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }, [])

  const verifyEmail = useCallback(async (email, code) => {
    try {
      return await authService.verifyEmail(email, code)
    } catch (error) {
      console.error('Email verification failed:', error)
      throw error
    }
  }, [])

  /**
   * Send Supabase password reset email
   */
  const forgotPassword = useCallback(async (email) => {
    if (!supabase) throw new Error('Password reset is not configured.')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw new Error(error.message)
  }, [])

  /**
   * Logout user and clear session
   */
  const logout = useCallback(() => {
    clearSession()
    notifyAdminStatus(null)
  }, [clearSession, notifyAdminStatus])

  // ==================== Effects ====================

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)

    // No token - clear and exit
    if (!token) {
      clearSession()
      setLoading(false)
      return
    }

    // Session expired - clear and exit
    if (!isSessionValid()) {
      clearSession()
      setLoading(false)
      return
    }

    // Load user from storage
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER)
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        updateActivity()
        notifyAdminStatus(parsedUser.role)
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        clearSession()
      }
    }

    setLoading(false)

    // ==================== Event Listeners ====================

    /**
     * Handle storage changes from other tabs (cross-tab sync)
     */
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEYS.TOKEN || e.key === STORAGE_KEYS.USER) {
        const newToken = localStorage.getItem(STORAGE_KEYS.TOKEN)
        const newUser = localStorage.getItem(STORAGE_KEYS.USER)

        if (!newToken) {
          // Logged out in another tab
          clearSession()
          window.location.href = '/login'
        } else if (newUser) {
          // Logged in or switched accounts in another tab
          try {
            const parsed = JSON.parse(newUser)
            setUser(parsed)
            updateActivity()
            notifyAdminStatus(parsed.role)
          } catch (error) {
            console.error('Failed to parse user from storage event:', error)
          }
        }
      }
    }

    /**
     * Handle user activity to update last activity timestamp
     */
    const handleActivity = () => updateActivity()

    // Register storage listener
    window.addEventListener('storage', handleStorageChange)

    // Register activity listeners
    ACTIVITY_EVENTS.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true })
    })

    // Start session check interval
    const sessionCheckInterval = setInterval(checkSessionAndRedirect, SESSION_CHECK_INTERVAL)

    // Cleanup on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      ACTIVITY_EVENTS.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
      clearInterval(sessionCheckInterval)
    }
  }, [isSessionValid, updateActivity, clearSession, notifyAdminStatus, checkSessionAndRedirect])

  // ==================== Context Value ====================

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      verifyEmail,
      forgotPassword,
      logout,
      isAuthenticated: !!user,
    }),
    [user, loading, login, register, verifyEmail, forgotPassword, logout]
  )

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to access auth context
 * @throws {Error} If used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Export constants for testing
export { SESSION_TIMEOUT, LAST_ACTIVITY_KEY, STORAGE_KEYS }
