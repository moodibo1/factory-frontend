import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '@/components/shared/Navbar'
import SecurityProtection from '@/components/shared/SecurityProtection'
import { useTranslation } from 'react-i18next'

export default function AppLayout() {
  const { i18n } = useTranslation()
  const lang = i18n.language?.substring(0, 2) || 'ar'
  const isRTL = lang === 'ar'

  // Keep the <html> element in sync whenever language changes
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang, isRTL])

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <SecurityProtection />
      <Navbar />
      <main 
        className="flex-1 max-w-2xl w-full mx-auto px-4 py-4"
        style={{ paddingBottom: 'max(6rem, env(safe-area-inset-bottom))' }}
      >
        <Outlet />
      </main>
    </div>
  )
}
