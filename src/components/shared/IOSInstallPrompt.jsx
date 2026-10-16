import { useState, useEffect } from 'react'
import { X, Share } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function IOSInstallPrompt() {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem('ios-install-prompt-dismissed')
    if (dismissed) return

    // Detect iOS (iPhone + iPad via maxTouchPoints hack for iPadOS)
    const isIOS = /iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent))
    
    // Check if not already installed (standalone mode)
    const isStandalone = window.navigator.standalone === true || 
                         window.matchMedia('(display-mode: standalone)').matches

    if (isIOS && !isStandalone) {
      // Delay prompt 2 seconds after page load
      const timer = setTimeout(() => setShow(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setShow(false)
    localStorage.setItem('ios-install-prompt-dismissed', 'true')
  }

  if (!show) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 animate-in slide-in-from-bottom-5 duration-300">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-br from-[#00A89B]/5 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00A89B] flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-lg">D1</span>
            </div>
            <h3 className="font-bold text-gray-900">{t('ios_install_title')}</h3>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all active:scale-90"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Instructions */}
        <div className="p-4 space-y-3">
          <p className="text-sm text-gray-600 leading-relaxed">
            {t('ios_install_instructions')}
          </p>
          
          {/* Visual steps */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
              <Share size={16} className="text-blue-600" />
            </div>
            <div className="flex-1 text-xs text-gray-500">
              <span className="font-semibold text-gray-700">1.</span> اضغط زر المشاركة 
              <span className="inline-block mx-1 px-1.5 py-0.5 bg-white rounded border border-gray-200 font-mono text-[10px]">⎋</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#00A89B]/10 flex items-center justify-center border border-[#00A89B]/20">
              <span className="text-[#00A89B] font-bold text-lg">+</span>
            </div>
            <div className="flex-1 text-xs text-gray-500">
              <span className="font-semibold text-gray-700">2.</span> اختر "إضافة إلى الشاشة الرئيسية"
            </div>
          </div>
        </div>

        {/* Dismiss button */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleDismiss}
            className="w-full py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            {t('ios_install_dismiss')}
          </button>
        </div>
      </div>
    </div>
  )
}
