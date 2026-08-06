import { Outlet } from 'react-router-dom'
import Navbar from '@/components/shared/Navbar'
import SecurityProtection from '@/components/shared/SecurityProtection'
import { useTranslation } from 'react-i18next'

export default function AppLayout() {
  const { i18n } = useTranslation()
  const isRTL = i18n.language === 'ar' || i18n.language.startsWith('ar')

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
      <SecurityProtection />
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-4 pb-24">
        <Outlet />
      </main>
    </div>
  )
}
