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
  const lang = i18n.language?.substring(0, 2) || 'ar'
  const appName = lang === 'ar' ? 'ديوان' : 'D1'

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

  const ActionButton = ({ onClick, children, title, className = '' }) => (
    <button
      onClick={onClick}
      title={title}
      className={clsx(
        'p-2 rounded-xl text-gray-500 transition-all duration-200',
        'hover:text-[#00A89B] hover:bg-[#00A89B]/8 active:scale-90',
        className
      )}
    >
      {children}
    </button>
  )

  return (
    <>
      {/* ── Desktop Top Bar ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full d1-glass border-b border-white/40 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Brand */}
          <Link to="/" className="group flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00A89B] to-[#00D4C8] flex items-center justify-center shadow-md shadow-[#00A89B]/20 transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
              <span className="text-white font-extrabold text-sm tracking-tight">D1</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-[#00A89B] hidden sm:block">{appName}</span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Desktop Nav Links */}
            <nav className="hidden sm:flex items-center gap-0.5">
              {navLinks.map(({ to, label, icon: Icon }) => {
                const isActive = pathname === to
                return (
                  <Link
                    key={to}
                    to={to}
                    className={clsx(
                      'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200',
                      isActive
                        ? 'text-[#00A89B] bg-[#00A89B]/8'
                        : 'text-gray-500 hover:text-[#00A89B] hover:bg-gray-100/60 active:scale-95'
                    )}
                  >
                    <Icon size={18} className={clsx('transition-transform duration-200', isActive && 'scale-110')} />
                    {label}
                  </Link>
                )
              })}
            </nav>

            <div className="hidden sm:block w-px h-6 bg-gray-200/70 mx-1" />

            {/* Global Actions */}
            <NotificationBell />
            <ActionButton onClick={changeLang} title="تغيير اللغة">
              <Globe size={18} />
            </ActionButton>
            <ActionButton onClick={toggle}>
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </ActionButton>
            <ActionButton onClick={handleLogout} title={t('logout')} className="hover:text-red-500 hover:bg-red-500/8">
              <LogOut size={18} />
            </ActionButton>
          </div>
        </div>
      </header>

      {/* ── Mobile Bottom Navigation ────────────────────────────── */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 d1-glass border-t border-white/40 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between px-2 py-1.5">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={clsx(
                  'flex flex-col items-center gap-0.5 p-2 rounded-2xl transition-all duration-200 flex-1 min-w-0 active:scale-90',
                  isActive ? 'text-[#00A89B]' : 'text-gray-400 hover:text-gray-600'
                )}
              >
                <div className={clsx(
                  'p-1.5 rounded-xl transition-all duration-300',
                  isActive && 'bg-[#00A89B]/10 scale-110'
                )}>
                  <Icon size={20} />
                </div>
                <span className="text-[10px] truncate max-w-full font-medium leading-none">
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
