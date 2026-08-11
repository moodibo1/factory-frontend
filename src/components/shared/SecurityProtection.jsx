import { useEffect, useState } from 'react'
import { useAuth } from '@/store/AuthContext'
import { useTranslation } from 'react-i18next'

export default function SecurityProtection() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    // Only apply security to non-admin users
    if (!user || user.role === 'admin') {
      // Remove all security restrictions for admins
      document.body.classList.remove('blurred-security')
      document.body.style.filter = ''
      return
    }

    // === SECURITY ONLY FOR REGULAR USERS ===

    // Disable right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault()
      e.stopPropagation()
      showScreenshotWarning()
      return false
    }

    // Disable common keyboard shortcuts for screenshots and devtools
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase()
      const ctrl = e.ctrlKey || e.metaKey
      const shift = e.shiftKey

      // Prevent PrintScreen
      if (key === 'printscreen' || e.keyCode === 44 || e.which === 44) {
        e.preventDefault()
        e.stopPropagation()
        navigator.clipboard.writeText('')
        showScreenshotWarning()
        return false
      }

      // Prevent Ctrl+P (Print)
      if (ctrl && key === 'p') {
        e.preventDefault()
        e.stopPropagation()
        showScreenshotWarning()
        return false
      }

      // Prevent Ctrl+S (Save)
      if (ctrl && key === 's') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // Prevent F12
      if (key === 'f12' || e.keyCode === 123) {
        e.preventDefault()
        e.stopPropagation()
        showScreenshotWarning()
        return false
      }

      // Prevent Ctrl+Shift+I (DevTools)
      if (ctrl && shift && key === 'i') {
        e.preventDefault()
        e.stopPropagation()
        showScreenshotWarning()
        return false
      }

      // Prevent Ctrl+Shift+J (Console)
      if (ctrl && shift && key === 'j') {
        e.preventDefault()
        e.stopPropagation()
        showScreenshotWarning()
        return false
      }

      // Prevent Ctrl+Shift+C (Inspect)
      if (ctrl && shift && key === 'c') {
        e.preventDefault()
        e.stopPropagation()
        showScreenshotWarning()
        return false
      }

      // Prevent Ctrl+U (View Source)
      if (ctrl && key === 'u') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }

    // Detect when user switches away from tab (screenshot attempt)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.body.classList.add('blurred-security')
      } else {
        setTimeout(() => {
          document.body.classList.remove('blurred-security')
        }, 500)
      }
    }

    // Detect when window loses focus
    const handleBlur = () => {
      setTimeout(() => {
        document.body.classList.add('blurred-security')
      }, 100)
    }

    const handleFocus = () => {
      setTimeout(() => {
        document.body.classList.remove('blurred-security')
      }, 200)
    }

    // Disable copy/paste
    const handleCopy = (e) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    const handleCut = (e) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    // Detect screenshot tools (Windows Snipping Tool, etc)
    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase()
      if (key === 'printscreen' || e.keyCode === 44 || e.which === 44) {
        navigator.clipboard.writeText('')
        showScreenshotWarning()
      }
    }

    // Show warning
    const showScreenshotWarning = () => {
      setShowWarning(true)
      // Log security violation attempt
      logSecurityViolation('screenshot_attempt')
      setTimeout(() => setShowWarning(false), 3000)
    }

    // Log security violations to backend
    const logSecurityViolation = async (type) => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
        await fetch(`${baseUrl}/security/log`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            user_id: user.id,
            violation_type: type,
            timestamp: new Date().toISOString()
          })
        }).catch(() => {}) // Silent fail
      } catch (e) {
        // Silent fail
      }
    }

    // Attach all event listeners with capture phase
    document.addEventListener('contextmenu', handleContextMenu, { capture: true })
    document.addEventListener('keydown', handleKeyDown, { capture: true })
    document.addEventListener('keyup', handleKeyUp, { capture: true })
    document.addEventListener('copy', handleCopy, { capture: true })
    document.addEventListener('cut', handleCut, { capture: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)

    // Detect DevTools
    const detectDevTools = () => {
      const threshold = 160
      const widthDiff = window.outerWidth - window.innerWidth
      const heightDiff = window.outerHeight - window.innerHeight
      
      if (widthDiff > threshold || heightDiff > threshold) {
        logSecurityViolation('devtools_open')
        document.body.classList.add('blurred-security')
      } else {
        document.body.classList.remove('blurred-security')
      }
    }

    const devToolsInterval = setInterval(detectDevTools, 1000)

    // Additional protection: monitor for screenshot hotkeys in different browsers
    const monitorScreenshots = setInterval(() => {
      // Clear clipboard periodically to prevent PrintScreen buffer
      try {
        navigator.clipboard.writeText('').catch(() => {})
      } catch (e) {}
    }, 500)

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, { capture: true })
      document.removeEventListener('keydown', handleKeyDown, { capture: true })
      document.removeEventListener('keyup', handleKeyUp, { capture: true })
      document.removeEventListener('copy', handleCopy, { capture: true })
      document.removeEventListener('cut', handleCut, { capture: true })
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
      clearInterval(devToolsInterval)
      clearInterval(monitorScreenshots)
      document.body.classList.remove('blurred-security')
      document.body.style.filter = ''
    }
  }, [user])

  // Don't show watermark or warnings for admins
  if (!user || user.role === 'admin') return null

  return (
    <>
      {/* Watermark with user email - only for regular users */}
      <div className="security-watermark" data-user={user.email} />
      
      {/* Screenshot warning overlay */}
      {showWarning && (
        <div className="screenshot-warning active">
          <div>⚠️ {t('security_warning')} ⚠️</div>
          <div style={{ fontSize: '18px', marginTop: '20px' }}>
            {t('screenshot_denied')}
          </div>
          <div style={{ fontSize: '14px', marginTop: '10px', opacity: 0.9 }}>
            {t('activity_logged')}
          </div>
        </div>
      )}
    </>
  )
}


