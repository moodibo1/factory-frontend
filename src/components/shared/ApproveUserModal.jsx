import { X } from 'lucide-react'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'

const CATEGORY_STYLES = {
  lab:        'border-purple-500 text-purple-600 bg-purple-500/10 hover:bg-purple-500/20',
  filling:    'border-orange-500 text-orange-600 bg-orange-500/10 hover:bg-orange-500/20',
  production: 'border-blue-500 text-blue-600 bg-blue-500/10 hover:bg-blue-500/20',
  admin:      'border-red-500 text-red-600 bg-red-500/10 hover:bg-red-500/20',
}

export default function ApproveUserModal({ user, onClose, onApprove }) {
  const { t, i18n } = useTranslation()

  const categories = [
    { value: 'lab',        label: t('labs') },
    { value: 'filling',    label: t('filling') },
    { value: 'production', label: t('production') },
    { value: 'admin',      label: t('admin') },
  ]

  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr'

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-background border rounded-2xl shadow-xl flex flex-col overflow-hidden" dir={dir}>
        <div className="flex items-center justify-between p-4 border-b bg-muted/30">
          <div>
            <h3 className="font-bold">{t('classify_user')}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{t('select_department_for', { name: user.name })}</p>
          </div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 grid grid-cols-2 gap-3">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => onApprove(c.value)}
              className={clsx(
                'py-4 rounded-xl border-2 flex flex-col items-center justify-center gap-1 font-semibold text-sm transition',
                CATEGORY_STYLES[c.value]
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
