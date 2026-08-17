import { useNavigate } from 'react-router-dom'
import { FlaskConical, Package, Factory } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function HomePage() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.substring(0, 2) || 'ar'
  const appName = lang === 'ar' ? 'ديوان' : 'D1'
  const welcomeText = lang === 'ar' ? ' انشر. شارك. حل المشاكل.' : 'Publish. Share. Solve problems.'

  const categories = [
    {
      id: 'lab',
      label: t('labs'),
      icon: FlaskConical,
      description: lang === 'ar' ? 'فحوصات الجودة والتحاليل المخبرية' : 'Quality tests & lab analysis',
      gradient: 'from-teal-500/10 to-cyan-500/8',
      iconBg: 'bg-gradient-to-br from-teal-50 to-cyan-50',
    },
    {
      id: 'filling',
      label: t('filling'),
      icon: Package,
      description: lang === 'ar' ? 'خطوط التعبئة والتغليف' : 'Filling & packaging lines',
      gradient: 'from-blue-500/10 to-indigo-500/8',
      iconBg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    },
    {
      id: 'production',
      label: t('production'),
      icon: Factory,
      description: lang === 'ar' ? 'إنتاج وتشغيل المعدات' : 'Equipment operation & production',
      gradient: 'from-violet-500/10 to-purple-500/8',
      iconBg: 'bg-gradient-to-br from-violet-50 to-purple-50',
    },
  ]

  return (
    <div className="flex flex-col gap-8 py-6">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="d1-fade-in-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#00A89B] via-teal-600 to-[#00D4C8] p-8 sm:p-10 text-white shadow-xl shadow-[#00A89B]/15">
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <span className="font-extrabold text-lg">{appName}</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 leading-tight">
            {lang === 'ar' ? 'نظام ديوان' : 'D1 System'}
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-md leading-relaxed">
            {welcomeText}
          </p>
        </div>
      </div>

      {/* ── Category Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {categories.map((cat, i) => (
          <button
            key={cat.id}
            onClick={() => navigate(`/channel/${cat.id}`)}
            className={`d1-fade-in-up d1-stagger-${i + 1} group relative flex flex-col items-center gap-4 p-8 sm:p-10 rounded-3xl border border-gray-100/80 bg-white text-center w-full transition-all duration-300 hover:-translate-y-1.5 hover:border-[#00A89B]/30 hover:shadow-xl hover:shadow-[#00A89B]/8 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A89B]`}
          >
            {/* Icon container — oversized, with glow-on-hover */}
            <div className={`relative p-5 rounded-2xl ${cat.iconBg} transition-all duration-300 group-hover:scale-110`}>
              <cat.icon size={40} className="text-[#00A89B] transition-transform duration-300" strokeWidth={1.6} />
              {/* Glow ring on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:d1-glow-breathe" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-lg font-bold text-gray-900 tracking-tight">{cat.label}</span>
              <span className="text-xs text-gray-400 font-medium leading-relaxed">{cat.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
