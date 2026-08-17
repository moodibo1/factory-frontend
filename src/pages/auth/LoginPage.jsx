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
        // Hard reset form after success inside registration
        setIsLogin(true)
        setEmail('')
        setPassword('')
        // Display toast / success to user
        setError('حسابك قيد الانتظار لموافقة الأدمن')
      }
    } catch (err) {
      const msg = err.message || ''
      if (msg.includes('PENDING')) setError('حسابك قيد الانتظار لموافقة الأدمن')
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 flex items-center justify-center px-4 relative" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Language Switcher */}
      <button
        onClick={changeLang}
        className="absolute top-5 right-5 rtl:left-5 rtl:right-auto p-2.5 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-400 hover:text-[#00A89B] rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm border border-gray-100 active:scale-90"
        title="Change Language"
      >
        <Globe size={18} />
      </button>

      <div className="w-full max-w-sm flex flex-col gap-6 d1-fade-in-up">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-gradient-to-br from-[#00A89B] to-[#00D4C8] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00A89B]/20">
            <Factory size={32} className="text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tight">D1</h1>
            <p className="text-sm text-gray-400 mt-0.5">National health Factory System</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-5 shadow-lg shadow-black/[0.04]">
          {/* Tab Switcher */}
          <div className="flex rounded-xl overflow-hidden border border-gray-100 bg-gray-50 p-0.5">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError('') }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${isLogin ? 'bg-[#00A89B] text-white shadow-sm shadow-[#00A89B]/20' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {t('login_title')}
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError('') }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${!isLogin ? 'bg-[#00A89B] text-white shadow-sm shadow-[#00A89B]/20' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {t('register')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {!isLogin && (
              <input
                type="text"
                placeholder={t('full_name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-[#00A89B]/20 focus:border-[#00A89B]/30 transition-all"
              />
            )}
            <input
              type="email"
              placeholder={t('email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-[#00A89B]/20 focus:border-[#00A89B]/30 transition-all"
            />
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder={t('password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-[#00A89B]/20 focus:border-[#00A89B]/30 transition-all rtl:pl-10 ltr:pr-10"
              />
              <button type="button" onClick={() => setShowPass(v => !v)} className="absolute rtl:left-3 ltr:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition active:scale-90">
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between mt-0.5">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${rememberMe ? 'bg-[#00A89B] border-[#00A89B]' : 'border-gray-300 group-hover:border-[#00A89B]/50'}`}>
                    {rememberMe && <Check size={12} className="text-white" />}
                  </div>
                  <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="hidden" />
                  <span className="text-xs text-gray-400 select-none">{t('remember_me')}</span>
                </label>
                <button type="button" onClick={() => { setShowForgot(true); setForgotSuccess('') }} className="text-xs text-[#00A89B] hover:underline transition">
                  {t('forgot_password')}
                </button>
              </div>
            )}

            {error && (
              <p className={`text-sm text-center py-2 px-3 rounded-xl ${error.includes('✅') || error.includes('إرسال') || error.includes('تحقق') || error.includes('انتظار') ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00A89B] text-white py-3 rounded-xl font-semibold hover:bg-[#00A89B]/90 transition-all duration-200 disabled:opacity-50 active:scale-[0.98] shadow-md shadow-[#00A89B]/20 mt-1"
            >
              {loading ? t('loading') : isLogin ? t('login') : t('register')}
            </button>
          </form>
        </div>
      </div>

      {/* ── Forgot Password Modal ──────────────────────────── */}
      {showForgot && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 d1-backdrop-in" onClick={() => setShowForgot(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="w-full max-w-sm bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl d1-scale-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                    <KeyRound size={18} className="text-[#00A89B]" />
                  </div>
                  <h2 className="font-bold">{t('forgot_password')}</h2>
                </div>
                <button type="button" onClick={() => setShowForgot(false)} className="text-gray-400 hover:text-gray-600 transition active:scale-90">
                  <X size={18} />
                </button>
              </div>
              {forgotSuccess ? (
                <p className="text-sm text-emerald-500 bg-emerald-50 p-3 rounded-xl">{forgotSuccess}</p>
              ) : (
                <form onSubmit={handleRequestReset} className="flex flex-col gap-3">
                  <p className="text-sm text-gray-400">{t('enter_email_for_recovery')}</p>
                  <input
                    type="email"
                    placeholder={t('email')}
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-[#00A89B]/20 transition-all"
                  />
                  {forgotError && <p className="text-xs text-red-500 text-center">{forgotError}</p>}
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full bg-[#00A89B] text-white py-3 rounded-xl font-semibold hover:bg-[#00A89B]/90 mt-1 transition-all active:scale-[0.98] shadow-md shadow-[#00A89B]/20"
                  >
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
