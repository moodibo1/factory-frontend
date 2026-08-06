import { useState } from 'react'
import { useAuth } from '@/store/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Eye, Factory, KeyRound, X, Check } from 'lucide-react'

export default function LoginPage() {
  const { login, register, verifyEmail } = useAuth()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [step, setStep] = useState('auth')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [verifyCode, setVerifyCode] = useState('')
  const [showForgot, setShowForgot] = useState(false)
  const [forgotStep, setForgotStep] = useState(1)
  const [forgotEmail, setForgotEmail] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [forgotError, setForgotError] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotSuccess, setForgotSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isLogin) {
        await login(email, password, rememberMe)
        navigate('/')
      } else {
        setStep('verify')
        await register(name, email, password)
        setError('تم إرسال رمز التحقق إلى بريدك الإلكتروني. الرجاء إدخاله أدناه.')
      }
    } catch (err) {
      const msg = err.message || ''
      if (msg.includes('PENDING')) setError('حسابك قيد المراجعة. انتظر موافقة الإدارة.')
      else if (msg.includes('REJECTED')) setError('تم رفض طلب انضمامك.')
      else if (msg.includes('Invalid credentials')) setError('بيانات الدخول غير صحيحة')
      else setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await verifyEmail(email, verifyCode)
      setStep('auth')
      setIsLogin(true)
      setEmail('')
      setPassword('')
      setVerifyCode('')
      setError('✅ تم تأكيد الحساب بنجاح! حسابك الآن قيد المراجعة.')
    } catch (err) {
      setError(err.message || 'الرمز غير صحيح')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestCode = async (e) => {
    e.preventDefault()
    if (!forgotEmail) return
    setForgotLoading(true)
    setForgotError('')
    try {
      await fetch('http://localhost:8000/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      })
      setForgotStep(2)
      setForgotSuccess('تم إرسال الكود إلى بريدك الإلكتروني.')
    } catch {
      setForgotError('حدث خطأ في الإرسال')
    } finally {
      setForgotLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setForgotLoading(true)
    setForgotError('')
    try {
      const res = await fetch('http://localhost:8000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, code: resetCode, new_password: newPassword })
      })
      if (!res.ok) throw new Error('الكود غير صحيح')
      setShowForgot(false)
      setIsLogin(true)
      setEmail(forgotEmail)
      setPassword(newPassword)
      setError('تم تغيير كلمة المرور بنجاح.')
    } catch (err) {
      setForgotError(err.message)
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-primary/10 p-4 rounded-2xl">
            <Factory size={36} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold">النظام</h1>
          <p className="text-sm text-muted-foreground">المصنع الوطني</p>
        </div>

        <div className="border rounded-2xl p-6 flex flex-col gap-4 bg-card shadow-sm">
          {step === 'auth' ? (
            <>
              <div className="flex rounded-xl overflow-hidden border">
                <button onClick={() => { setIsLogin(true); setError('') }} className={`flex-1 py-2 text-sm font-medium transition ${isLogin ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>تسجيل الدخول</button>
                <button onClick={() => { setIsLogin(false); setError('') }} className={`flex-1 py-2 text-sm font-medium transition ${!isLogin ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>حساب جديد</button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {!isLogin && (
                  <input type="text" placeholder="الاسم الكامل" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary" />
                )}
                <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary" />
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary pl-10" />
                  <button type="button" onClick={() => setShowPass(v => !v)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><Eye size={17} /></button>
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between mt-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-primary border-primary' : 'border-muted-foreground group-hover:border-primary'}`}>
                        {rememberMe && <Check size={12} className="text-white" />}
                      </div>
                      <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="hidden" />
                      <span className="text-xs text-muted-foreground select-none">تذكرني</span>
                    </label>
                    <button type="button" onClick={() => { setShowForgot(true); setForgotStep(1); setForgotSuccess('') }} className="text-xs text-primary hover:underline">
                      نسيت كلمة المرور؟
                    </button>
                  </div>
                )}

                {error && <p className={`text-sm text-center ${error.includes('✅') || error.includes('إرسال') ? 'text-green-500' : 'text-destructive'}`}>{error}</p>}

                <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 mt-1">
                  {loading ? 'جاري...' : isLogin ? 'دخول' : 'إرسال طلب الانضمام'}
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={handleVerify} className="flex flex-col gap-3">
              <h2 className="font-bold text-center mb-2">تأكيد البريد الإلكتروني</h2>
              <input 
                type="text" 
                placeholder="رمز التحقق" 
                value={verifyCode} 
                onChange={(e) => setVerifyCode(e.target.value)} 
                required 
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary text-center font-mono tracking-widest" 
              />
              {error && <p className={`text-sm text-center ${error.includes('✅') || error.includes('إرسال') ? 'text-green-500' : 'text-destructive'}`}>{error}</p>}
              <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 mt-1">
                {loading ? 'جاري...' : 'تأكيد الحساب'}
              </button>
              <button type="button" onClick={() => { setStep('auth'); setIsLogin(true); setError('') }} className="text-sm text-muted-foreground hover:text-foreground mt-2">
                العودة لتسجيل الدخول
              </button>
            </form>
          )}
        </div>
      </div>

      {showForgot && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setShowForgot(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4" dir="rtl">
            <div className="w-full max-w-sm bg-background border rounded-2xl p-6 flex flex-col gap-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound size={20} className="text-primary" />
                  <h2 className="font-bold">استعادة كلمة المرور</h2>
                </div>
                <button onClick={() => setShowForgot(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
              </div>

              {forgotStep === 1 ? (
                <form onSubmit={handleRequestCode} className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">أدخل بريدك الإلكتروني وسنرسل لك رمز استعادة.</p>
                  <input type="email" placeholder="البريد الإلكتروني" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary" />
                  {forgotError && <p className="text-xs text-destructive text-center">{forgotError}</p>}
                  <button type="submit" disabled={forgotLoading} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 mt-1">
                    {forgotLoading ? 'جاري الإرسال...' : 'إرسال الرمز'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="flex flex-col gap-3">
                  {forgotSuccess && <p className="text-sm text-green-500 bg-green-500/10 p-3 rounded-xl">{forgotSuccess}</p>}
                  <input type="text" placeholder="رمز الاستعادة" value={resetCode} onChange={(e) => setResetCode(e.target.value)} required className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary tracking-widest font-mono text-center" />
                  <input type="password" placeholder="كلمة المرور الجديدة" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={4} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary" />
                  {forgotError && <p className="text-xs text-destructive text-center">{forgotError}</p>}
                  <button type="submit" disabled={forgotLoading} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 mt-1">
                    {forgotLoading ? 'جاري الحفظ...' : 'حفظ كلمة المرور'}
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
