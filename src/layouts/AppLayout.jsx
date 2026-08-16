import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '@/components/shared/Navbar'
import SecurityProtection from '@/components/shared/SecurityProtection'
import { useTranslation } from 'react-i18next'

export default function AppLayout() {
  const { i18n } = useTranslation()
  const lang = i18n.language?.substring(0, 2) || 'ar'
  const isRTL = lang === 'ar'
  const appName = isRTL ? 'ديوان' : 'D1'

  // Keep the <html> element in sync whenever language changes
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    document.title = appName
  }, [lang, isRTL, appName])

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 overflow-x-hidden flex flex-col font-sans" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="system-watermark" aria-hidden="true" />
      <SecurityProtection />
      <Navbar />
      <main
        className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6"
        style={{ paddingBottom: 'max(6rem, env(safe-area-inset-bottom))' }}
      >
        <Outlet />
      </main>
    </div>
  )
}
