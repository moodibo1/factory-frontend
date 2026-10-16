import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function PWASplash() {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Only show splash in PWA standalone mode
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  window.navigator.standalone === true
    
    // Check if already shown this session
    const splashShown = sessionStorage.getItem('pwa-splash-shown')
    
    if (isPWA && !splashShown) {
      setShow(true)
      sessionStorage.setItem('pwa-splash-shown', 'true')
      
      // Auto-hide after 3 seconds
      const timer = setTimeout(() => setShow(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-[#00A89B] flex items-center justify-center animate-in fade-in duration-500">
      {/* Video placeholder - Replace with your own video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="/splash-poster.jpg"
      >
        <source src="/splash-video.mp4" type="video/mp4" />
      </video>

      {/* Fallback animated placeholder if video doesn't exist */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-[#00A89B] to-[#007B6E]">
        {/* D1 Logo */}
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl animate-pulse">
            <span className="text-white font-black text-4xl">D1</span>
          </div>
          <div className="absolute -inset-4 border-4 border-white/30 rounded-[2rem] animate-ping" style={{ animationDuration: '2s' }}></div>
        </div>

        {/* App Name */}
        <div className="text-center">
          <h1 className="text-white text-3xl font-black tracking-tight mb-2">
            {t('app_name')}
          </h1>
          <p className="text-white/80 text-sm font-medium">
            {t('factory_management_system', { defaultValue: 'نظام إدارة المصنع' })}
          </p>
        </div>
      </div>

      {/* Instructions overlay (only in dev mode) */}
      {import.meta.env.DEV && (
        <div className="absolute bottom-8 left-8 right-8 p-4 bg-black/80 rounded-xl text-white text-xs leading-relaxed max-w-md mx-auto">
          <strong className="block mb-2 text-yellow-400">🎬 Replace Splash Video:</strong>
          <ol className="space-y-1 list-decimal list-inside">
            <li>Place your video at <code className="bg-white/20 px-1 rounded">public/splash-video.mp4</code></li>
            <li>Recommended: 9:16 portrait, 5-10 sec loop, &lt;5MB</li>
            <li>Optional poster: <code className="bg-white/20 px-1 rounded">public/splash-poster.jpg</code></li>
          </ol>
        </div>
      )}
    </div>
  )
}
