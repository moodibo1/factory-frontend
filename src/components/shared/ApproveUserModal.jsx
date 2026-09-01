import { useState } from 'react'
import { X, CheckCircle2, ShieldPlus } from 'lucide-react'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'

const CATEGORY_STYLES = {
  lab: 'border-purple-200 text-purple-700 bg-purple-50 hover:border-purple-400 hover:bg-purple-100/50',
  secondary_packaging: 'border-orange-200 text-orange-700 bg-orange-50 hover:border-orange-400 hover:bg-orange-100/50',
  production: 'border-blue-200 text-blue-700 bg-blue-50 hover:border-blue-400 hover:bg-blue-100/50',
  qc: 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:border-emerald-400 hover:bg-emerald-100/50',
  admin: 'border-red-200 text-red-700 bg-red-50 hover:border-red-400 hover:bg-red-100/50',
}

const CATEGORY_ACTIVE = {
  lab: 'border-purple-500 bg-purple-100 ring-2 ring-purple-500/20',
  secondary_packaging: 'border-orange-500 bg-orange-100 ring-2 ring-orange-500/20',
  production: 'border-blue-500 bg-blue-100 ring-2 ring-blue-500/20',
  qc: 'border-emerald-500 bg-emerald-100 ring-2 ring-emerald-500/20',
  admin: 'border-red-500 bg-red-100 ring-2 ring-red-500/20',
}

export default function ApproveUserModal({ user, onClose, onApprove }) {
  const { t, i18n } = useTranslation()
  const [selected, setSelected] = useState([]) // مصفوفة لتخزين الأقسام المحددة

  const categories = [
    { value: 'lab', label: t('labs') },
        { value: 'secondary_packaging', label: t('secondary_packaging') },
    { value: 'production', label: t('production') },
    { value: 'qc', label: t('quality', { defaultValue: 'الجودة' }) },
    { value: 'admin', label: t('admin') },
  ]

  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr'

  const toggleCategory = (val) => {
    setSelected(prev => 
      prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val]
    )
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" dir={dir}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00A89B]/10 text-[#00A89B] rounded-xl">
              <ShieldPlus size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{t('classify_user')}</h3>
              <p className="text-sm text-gray-500">{t('select_department_for', { name: user.name })}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition">
            <X size={20} />
          </button>
        </div>

        {/* Multi-select Grid */}
        <div className="p-5 grid grid-cols-2 gap-3">
          {categories.map((c) => {
            const isActive = selected.includes(c.value)
            return (
              <button
                key={c.value}
                onClick={() => toggleCategory(c.value)}
                className={clsx(
                  'relative p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 font-semibold text-sm transition-all duration-200',
                  isActive ? CATEGORY_ACTIVE[c.value] : CATEGORY_STYLES[c.value],
                  c.value === 'admin' && 'col-span-2' // جعل الإدارة تأخذ العرض كاملاً
                )}
              >
                {isActive && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 size={18} className="animate-in zoom-in" />
                  </div>
                )}
                {c.label}
              </button>
            )
          })}
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t bg-gray-50 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition">
            {t('cancel', { defaultValue: 'إلغاء' })}
          </button>
          <button 
            onClick={() => onApprove(selected)} 
            disabled={selected.length === 0}
            className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-white bg-[#00A89B] hover:bg-[#009287] transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {t('confirm', { defaultValue: 'تأكيد القبول' })}
          </button>
        </div>
      </div>
    </div>
  )
}