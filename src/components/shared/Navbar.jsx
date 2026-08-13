import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Home, Sun, Moon, LogOut, ShieldCheck, Settings, User, Sparkles, Globe } from 'lucide-react'
import { useTheme } from '@/store/ThemeContext'
import { useAuth } from '@/store/AuthContext'
import NotificationBell from '@/components/shared/NotificationBell'
import { useTranslation } from 'react-i18next'

export default function Navbar() {
  const { pathname } = useLocation()
  const { dark, toggle } = useTheme()
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'
  const { t, i18n } = useTranslation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const changeLang = () => {
    const langs = ['ar', 'en', 'tr']
    const currentIndex = langs.indexOf(i18n.language.substring(0, 2))
    const nextLang = langs[(currentIndex + 1) % langs.length] || 'ar'
    i18n.changeLanguage(nextLang)
  }

  const navLink = (to, label, Icon) => (
    <Link
      key={to}
      to={to}
      className={`flex items-center gap-1.5 p-2 text-sm transition rounded-xl whitespace-nowrap ${pathname === to ? 'text-primary font-semibold bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
    >
      <Icon size={16} />
      {label}
    </Link>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="font-bold text-lg">{t('app_name')}</span>
        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            {navLink('/', t('home'), Home)}
            {navLink('/profile', t('my_account'), User)}
            {navLink('/search', t('smart_search'), Sparkles)}
            {isAdmin && navLink('/dashboard', t('reports'), LayoutDashboard)}
            {isAdmin && navLink('/admin', t('management'), ShieldCheck)}
          </nav>
          <div className="w-px h-6 bg-border mx-1" />
          <NotificationBell />
          <button onClick={changeLang} className="text-muted-foreground hover:text-primary transition shrink-0 px-1" title="تغيير اللغة">
            <Globe size={18} />
          </button>
          <button onClick={toggle} className="text-muted-foreground hover:text-foreground transition shrink-0 px-1">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive transition shrink-0 px-1" title={t('logout')}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
