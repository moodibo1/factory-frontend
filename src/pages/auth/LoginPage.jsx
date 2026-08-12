import { useState } from 'react'
import { useAuth } from '@/store/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Eye, Factory, KeyRound, X, Check, EyeOff, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function LoginPage() {
  const { login, register, forgotPassword } = useAuth()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotError, setForgotError] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotSuccess, setForgotSuccess] = useState('')

  const changeLang = () => {
    const langs = ['ar', 'en', 'tr']
    const currentIndex = langs.indexOf(i18n.language.substring(0, 2))
    const nextLang = langs[(currentIndex + 1) % langs.length] || 'ar'
    i18n.changeLanguage(nextLang)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isLogin) {
        await login(email, password, rememberMe)
        navigate('/')
      } else {
        await register(name, email, password)
        setError(t('msg_verification_sent'))
      }
    } catch (err) {
      const msg = err.message || ''
      if (msg.includes('PENDING')) setError(t('msg_account_pending'))
      else if (msg.includes('REJECTED')) setError(t('msg_account_rejected'))
      else if (msg.includes('Invalid credentials') || msg.includes('Invalid login')) setError(t('msg_invalid_credentials'))
      else setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestReset = async (e) => {
    e.preventDefault()
    if (!forgotEmail) return
    setForgotLoading(true)
    setForgotError('')
    setForgotSuccess('')
    try {
      await forgotPassword(forgotEmail)
      setForgotSuccess(t('msg_code_sent'))
    } catch {
      setForgotError(t('msg_send_error'))
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <button
        onClick={changeLang}
        className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-2 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition flex items-center justify-center"
        title="Change Language"
      >
        <Globe size={20} />
      </button>
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-primary/10 p-4 rounded-2xl">
            <Factory size={36} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{t('the_system')}</h1>
          <p className="text-sm text-muted-foreground">{t('national_factory')}</p>
        </div>

        <div className="border rounded-2xl p-6 flex flex-col gap-4 bg-card shadow-sm">
          <div className="flex rounded-xl overflow-hidden border">
            <button onClick={() => { setIsLogin(true); setError('') }} className={`flex-1 py-2 text-sm font-medium transition ${isLogin ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>{t('login_title')}</button>
            <button onClick={() => { setIsLogin(false); setError('') }} className={`flex-1 py-2 text-sm font-medium transition ${!isLogin ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>{t('register')}</button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {!isLogin && (
              <input type="text" placeholder={t('full_name')} value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary" />
            )}
            <input type="email" placeholder={t('email')} value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary" />
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} placeholder={t('password')} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary rtl:pl-10 ltr:pr-10" />
              <button type="button" onClick={() => setShowPass(v => !v)} className="absolute rtl:left-3 ltr:right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between mt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-primary border-primary' : 'border-muted-foreground group-hover:border-primary'}`}>
                    {rememberMe && <Check size={12} className="text-white" />}
                  </div>
                  <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="hidden" />
                  <span className="text-xs text-muted-foreground select-none">{t('remember_me')}</span>
                </label>
                <button type="button" onClick={() => { setShowForgot(true); setForgotSuccess('') }} className="text-xs text-primary hover:underline">
                  {t('forgot_password')}
                </button>
              </div>
            )}

            {error && <p className={`text-sm text-center ${error.includes('✅') || error.includes('إرسال') || error.includes('تحقق') ? 'text-green-500' : 'text-destructive'}`}>{error}</p>}

            <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 mt-1">
              {loading ? t('loading') : isLogin ? t('login') : t('register')}
            </button>
          </form>
        </div>
      </div>

      {showForgot && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setShowForgot(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="w-full max-w-sm bg-background border rounded-2xl p-6 flex flex-col gap-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound size={20} className="text-primary" />
                  <h2 className="font-bold">{t('forgot_password')}</h2>
                </div>
                <button onClick={() => setShowForgot(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
              </div>
              {forgotSuccess ? (
                <p className="text-sm text-green-500 bg-green-500/10 p-3 rounded-xl">{forgotSuccess}</p>
              ) : (
                <form onSubmit={handleRequestReset} className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">{t('enter_email_for_recovery')}</p>
                  <input type="email" placeholder={t('email')} value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary" />
                  {forgotError && <p className="text-xs text-destructive text-center">{forgotError}</p>}
                  <button type="submit" disabled={forgotLoading} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 mt-1">
                    {forgotLoading ? t('loading') : t('send_code')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
