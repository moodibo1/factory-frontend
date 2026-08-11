import AISearchBar from '@/components/shared/AISearchBar'
import { Sparkles, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function SearchPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  return (
    <div className="flex flex-col gap-6 py-4 pb-24">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
            title={t('back')}
          >
            <ArrowLeft size={20} className="rtl:rotate-0 ltr:rotate-180" />
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles size={22} className="text-purple-500" />
            {t('smart_search')}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1 mr-14 rtl:mr-14 ltr:ml-14 ltr:mr-0">
          {t('search_naturally')}
        </p>
      </div>

      <div className="flex flex-col gap-2 bg-purple-500/5 border border-purple-500/20 rounded-2xl p-4">
        <p className="text-xs text-muted-foreground font-medium">{t('search_examples')}</p>
        <div className="flex flex-wrap gap-2">
          {[
            t('all_emergency_orders'),
            t('open_lab_records'),
            t('packaging_notes_week'),
            t('delayed_records'),
          ].map((ex) => (
            <span key={ex} className="text-xs px-3 py-1 bg-purple-500/10 text-purple-600 rounded-full border border-purple-500/20">
              {ex}
            </span>
          ))}
        </div>
      </div>

      <AISearchBar />
    </div>
  )
}

