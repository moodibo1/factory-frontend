import { useState, useEffect } from 'react'
import { X, Share } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function IOSInstructions() {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const [doNotShow, setDoNotShow] = useState(false)

  useEffect(() => {
    // Check localStorage preference
    const dismissed = localStorage.getItem('ios-instructions-dismissed') === 'true'
    if (dismissed) return

    // Detect iOS (iPhone + iPad via maxTouchPoints for iPadOS)
    const isIOS = /iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent))
    
    // Check if NOT in standalone mode (i.e., not installed as PWA)
    const isStandalone = window.navigator.standalone === true || 
                         window.matchMedia('(display-mode: standalone)').matches

    if (isIOS && !isStandalone) {
      // Delay prompt 2 seconds after page load
      const timer = setTimeout(() => setShow(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setShow(false)
    if (doNotShow) {
      localStorage.setItem('ios-instructions-dismissed', 'true')
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[10001] flex items-end justify-center p-4 bg-black/60 animate-in fade-in duration-300">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5">
        {/* Video Header - Embedded at top of modal */}
        <div className="relative w-full aspect-video bg-gradient-to-br from-[#00A89B] to-[#007B6E] overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            webkit-playsinline="true"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/splash-video.mp4" type="video/mp4" />
          </video>
          
          {/* Fallback gradient overlay if video doesn't exist */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#00A89B]/90 to-[#007B6E]/90">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl animate-pulse">
              <span className="text-white font-black text-2xl">D1</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00A89B] flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-lg">D1</span>
            </div>
            <h3 className="font-bold text-gray-900">{t('ios_instructions_title')}</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all active:scale-90"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Instructions */}
        <div className="p-4 space-y-3">
          <p className="text-sm text-gray-600 leading-relaxed">
            {t('ios_instructions_body')}
          </p>
          
          {/* Visual steps */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
              <Share size={16} className="text-blue-600" />
            </div>
            <div className="flex-1 text-xs text-gray-500">
              <span className="font-semibold text-gray-700">1.</span> {t('ios_step_share')}
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#00A89B]/10 flex items-center justify-center border border-[#00A89B]/20">
              <span className="text-[#00A89B] font-bold text-lg">+</span>
            </div>
            <div className="flex-1 text-xs text-gray-500">
              <span className="font-semibold text-gray-700">2.</span> {t('ios_step_add_home')}
            </div>
          </div>
        </div>

        {/* Checkbox + Close button */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={doNotShow}
              onChange={(e) => setDoNotShow(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#00A89B] focus:ring-[#00A89B]"
            />
            <span className="text-sm text-gray-600">{t('do_not_show_again')}</span>
          </label>
          <button
            onClick={handleClose}
            className="w-full py-2.5 text-sm font-medium text-white bg-[#00A89B] rounded-xl hover:bg-[#007B6E] transition-colors active:scale-95"
          >
            {t('got_it')}
          </button>
        </div>
      </div>
    </div>
  )
}
