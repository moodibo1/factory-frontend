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

    // Detect DevTools (We log it, but disable screen blur)
    const detectDevTools = () => {
      const threshold = 160
      const widthDiff = window.outerWidth - window.innerWidth
      const heightDiff = window.outerHeight - window.innerHeight
      if (widthDiff > threshold || heightDiff > threshold) {
        logSecurityViolation('devtools_open')
      }
    }
    
    const devToolsInterval = setInterval(detectDevTools, 2000)

    // Cleanup when component unmounts
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, { capture: true })
      document.removeEventListener('keydown', handleKeyDown, { capture: true })
      document.removeEventListener('keyup', handleKeyUp, { capture: true })
      document.removeEventListener('copy', handleCopy, { capture: true })
      document.removeEventListener('cut', handleCut, { capture: true })
      clearInterval(devToolsInterval)
    }
  }, [user])

  // Don't render watermark for admins
  if (!user || user.role === 'admin') return null

  // Watermark text logic and robust overlay
  return (
    <>
      {/* Heavy watermark layer - using inline style pointerEvents needed */}
      <div 
        className="fixed inset-0 overflow-hidden pointer-events-none z-[99999]"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] flex flex-wrap items-center justify-center gap-16 md:gap-32 opacity-[0.03] dark:opacity-[0.04]">
          {Array.from({ length: 36 }).map((_, i) => (
            <div 
              key={i} 
              className="text-foreground font-light text-base md:text-lg rotate-[-30deg] pointer-events-none select-none text-center whitespace-nowrap px-8"
            >
              {user.name} &bull; {user.email}
            </div>
          ))}
        </div>
      </div>

      {showWarning && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-destructive text-destructive-foreground p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4 text-center animate-in zoom-in duration-200">
            <span className="text-5xl">⚠️</span>
            <div>
              <h2 className="text-2xl font-bold mb-2">تحذير أمني</h2>
              <p className="opacity-90">{t('security_violation') || 'محاولة التقاط الشاشة أو النسخ غير مسموح بها. تم تسجيل هذا النشاط.'}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
