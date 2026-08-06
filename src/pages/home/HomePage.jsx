import { useNavigate } from 'react-router-dom'
import { FlaskConical, Package, Factory } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function HomePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  const categories = [
    { id: 'lab', label: t('labs'), icon: FlaskConical, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'filling', label: t('filling'), icon: Package, color: 'text-green-500', bg: 'bg-green-500/10' },
    { id: 'production', label: t('production'), icon: Factory, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ]

  return (
    <div className="flex flex-col gap-6 py-6">
      <h1 className="text-2xl font-bold text-center">{t('main_sections')}</h1>
      <div className="flex flex-col gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigate(`/channel/${cat.id}`)}
            className={`flex items-center gap-4 p-5 rounded-2xl border ${cat.bg} hover:scale-[1.02] transition-transform text-right w-full`}
          >
            <div className={`p-3 rounded-xl ${cat.bg}`}>
              <cat.icon size={28} className={cat.color} />
            </div>
            <span className="text-xl font-semibold">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
