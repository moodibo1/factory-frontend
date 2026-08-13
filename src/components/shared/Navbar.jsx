import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Home, Sun, Moon, LogOut, ShieldCheck, User, Sparkles, Globe } from 'lucide-react'
import { useTheme } from '@/store/ThemeContext'
import { useAuth } from '@/store/AuthContext'
import NotificationBell from '@/components/shared/NotificationBell'
import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'

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

  const navLinks = [
    { to: '/', label: t('home'), icon: Home },
    { to: '/profile', label: t('my_account'), icon: User },
    { to: '/search', label: t('smart_search'), icon: Sparkles },
    ...(isAdmin ? [
      { to: '/dashboard', label: t('reports'), icon: LayoutDashboard },
      { to: '/admin', label: t('management'), icon: ShieldCheck }
    ] : [])
  ]

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-lg truncate flex-1">{t('app_name')}</span>
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Desktop Navigation */}
            <nav className="hidden sm:flex items-center gap-1 md:gap-3 mr-2 rtl:ml-2 rtl:mr-0">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={clsx(
                    'flex items-center gap-1.5 p-2 text-sm transition rounded-xl whitespace-nowrap',
                    pathname === to ? 'text-primary font-semibold bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <Icon size={16} />
                  <span className="hidden md:inline">{label}</span>
                </Link>
              ))}
            </nav>

            <div className="hidden sm:block w-px h-6 bg-border mx-1" />

            {/* Global Actions (Top Bar) */}
            <NotificationBell />
            <button onClick={changeLang} className="text-muted-foreground hover:text-primary transition shrink-0 p-1.5 rounded-xl hover:bg-muted/50" title="تغيير اللغة">
              <Globe size={18} />
            </button>
            <button onClick={toggle} className="text-muted-foreground hover:text-foreground transition shrink-0 p-1.5 rounded-xl hover:bg-muted/50">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive transition shrink-0 p-1.5 rounded-xl hover:bg-destructive/10" title={t('logout')}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-between px-2 py-2">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={clsx(
                  'flex flex-col items-center gap-1 p-2 rounded-xl transition flex-1 min-w-0',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <div className={clsx('p-1 rounded-full transition-colors', isActive && 'bg-primary/10')}>
                  <Icon size={20} className={isActive ? 'fill-primary/20' : ''} />
                </div>
                <span className="text-[10px] truncate max-w-full font-medium">
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
