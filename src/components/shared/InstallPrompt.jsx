import { useEffect, useMemo, useState } from 'react'
import { Download, Share, X } from 'lucide-react'
import './InstallPrompt.css'

const DISMISSED_KEY = 'd1-install-prompt-dismissed'

function isStandalone() {
  return window.matchMedia?.('(display-mode: standalone)').matches
    || window.navigator.standalone === true
}

function isIosSafari() {
  const userAgent = window.navigator.userAgent
  return /iphone|ipad|ipod/i.test(userAgent)
    && /safari/i.test(userAgent)
    && !/crios|fxios|opios|edgios/i.test(userAgent)
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [dismissed, setDismissed] = useState(() => {
    try {
      return window.sessionStorage.getItem(DISMISSED_KEY) === 'true'
    } catch {
      return false
    }
  })
  const [showIosInstructions, setShowIosInstructions] = useState(false)
  const [installed, setInstalled] = useState(isStandalone)
  const [ios] = useState(isIosSafari)
  const [language, setLanguage] = useState(document.documentElement.lang?.substring(0, 2) || 'ar')

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault()
      setDeferredPrompt(event)
    }
    const handleInstalled = () => {
      setInstalled(true)
      setDeferredPrompt(null)
    }
    const handleLanguageChange = () => {
      setLanguage(document.documentElement.lang?.substring(0, 2) || 'ar')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleInstalled)
    const languageObserver = new MutationObserver(handleLanguageChange)
    languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleInstalled)
      languageObserver.disconnect()
    }
  }, [])

  const isArabic = language === 'ar'
  const canInstall = Boolean(deferredPrompt) || ios
  const content = useMemo(() => isArabic
    ? {
      title: 'ثبّت تطبيق ديوان',
      description: 'وصول أسرع وتجربة أفضل من الشاشة الرئيسية.',
      install: 'تثبيت',
      later: 'لاحقاً',
      iosTitle: 'تثبيت ديوان على iPhone',
      iosBody: 'اضغط مشاركة في Safari، ثم اختر «إضافة إلى الشاشة الرئيسية».',
      understood: 'فهمت',
    }
    : {
      title: 'Install D1',
      description: 'Get faster access from your home screen.',
      install: 'Install',
      later: 'Not now',
      iosTitle: 'Install D1 on iPhone',
      iosBody: 'Tap Share in Safari, then choose “Add to Home Screen”.',
      understood: 'Got it',
    }, [isArabic])

  if (installed || dismissed || !canInstall) return null

  const dismiss = () => {
    setDismissed(true)
    try {
      window.sessionStorage.setItem(DISMISSED_KEY, 'true')
    } catch {
      // Session storage may be unavailable in private browsing.
    }
  }

  const install = async () => {
    if (ios) {
      setShowIosInstructions(true)
      return
    }
    const promptEvent = deferredPrompt
    if (!promptEvent) return
    await promptEvent.prompt()
    setDeferredPrompt(null)
    dismiss()
  }

  return (
    <>
      <aside className="install-prompt d1-scale-in" dir={isArabic ? 'rtl' : 'ltr'} aria-live="polite">
        <div className="install-prompt__copy">
          <strong>{content.title}</strong>
          <span>{content.description}</span>
        </div>
        <div className="install-prompt__actions">
          <button type="button" className="install-prompt__primary" onClick={install}>
            <Download size={16} aria-hidden="true" />
            {content.install}
          </button>
          <button type="button" className="install-prompt__dismiss" onClick={dismiss}>
            {content.later}
          </button>
          <button type="button" className="install-prompt__close" onClick={dismiss} aria-label={content.later}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </aside>

      {showIosInstructions && (
        <div className="install-modal-backdrop" role="presentation" onClick={() => setShowIosInstructions(false)}>
          <section
            className="install-modal d1-scale-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-modal-title"
            dir="rtl"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="install-prompt__close" onClick={() => setShowIosInstructions(false)} aria-label={content.later}>
              <X size={18} aria-hidden="true" />
            </button>
            <Share size={28} className="install-modal__icon" aria-hidden="true" />
            <h2 id="install-modal-title">{content.iosTitle}</h2>
            <p>{content.iosBody}</p>
            <button type="button" className="install-prompt__primary" onClick={() => { setShowIosInstructions(false); dismiss() }}>
              {content.understood}
            </button>
          </section>
        </div>
      )}
    </>
  )
}
