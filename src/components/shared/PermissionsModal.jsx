import { useState } from 'react'
import { X, Check, ShieldAlert, Layers } from 'lucide-react'
import { adminService } from '@/services/api'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'

const CATEGORY_STYLES = {
  lab: 'border-purple-200 text-purple-700 bg-purple-50 hover:border-purple-400',
  secondary_packaging: 'border-orange-200 text-orange-700 bg-orange-50 hover:border-orange-400',
  production: 'border-blue-200 text-blue-700 bg-blue-50 hover:border-blue-400',
  qc: 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:border-emerald-400',
  admin: 'border-red-200 text-red-700 bg-red-50 hover:border-red-400',
}

const CATEGORY_ACTIVE = {
  lab: 'border-purple-500 bg-purple-100 ring-2 ring-purple-500/20',
  secondary_packaging: 'border-orange-500 bg-orange-100 ring-2 ring-orange-500/20',
  production: 'border-blue-500 bg-blue-100 ring-2 ring-blue-500/20',
  qc: 'border-emerald-500 bg-emerald-100 ring-2 ring-emerald-500/20',
  admin: 'border-red-500 bg-red-100 ring-2 ring-red-500/20',
}

export default function PermissionsModal({ user, onClose, onSave }) {
  const { t, i18n } = useTranslation()
  const [activeTab, setActiveTab] = useState('permissions') // Tabs: 'permissions' | 'categories'
  const [loading, setLoading] = useState(false)
  
  // State for permissions
  const [perms, setPerms] = useState(() => {
    try {
      return JSON.parse(user.permissions || '{}')
    } catch {
      return { can_add: true, can_delete: false, can_edit_permissions: false }
    }
  })

  // State for multi-categories
  const [selectedCats, setSelectedCats] = useState(user.categories || [])

  const categoriesList = [
    { value: 'lab', label: t('labs') },
        { value: 'secondary_packaging', label: t('secondary_packaging') },
    { value: 'production', label: t('production') },
    { value: 'qc', label: t('quality', { defaultValue: 'الجودة' }) },
    { value: 'admin', label: t('admin') },
  ]

  const togglePerm = (key) => setPerms(prev => ({ ...prev, [key]: !prev[key] }))
  
  const toggleCat = (val) => {
    setSelectedCats(prev => prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val])
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // تحديث الصلاحيات والأقسام معاً!
      await adminService.updatePermissions(user.id, JSON.stringify(perms))
      // استدعاء دالة تحديث حالة/أقسام الموظف الموجودة مسبقاً
      await adminService.approveUser(user.id, selectedCats) 
      onSave()
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const ToggleSwitch = ({ label, desc, checked, onChange, disabled }) => (
    <div className={clsx('flex items-center justify-between p-4 border rounded-xl bg-white hover:border-[#00A89B]/30 transition-colors', disabled && 'opacity-50 pointer-events-none')}>
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-sm text-gray-900">{label}</span>
        <span className="text-xs text-gray-500">{desc}</span>
      </div>
      <button
        onClick={onChange}
        disabled={disabled}
        className={clsx(
          'relative w-12 h-6 rounded-full transition-colors',
          checked ? 'bg-[#00A89B]' : 'bg-gray-200'
        )}
      >
        <div className={clsx(
          'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm',
          checked ? 'rtl:-translate-x-6 ltr:translate-x-6' : 'translate-x-1'
        )} />
      </button>
    </div>
  )

  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-md bg-gray-50 border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" dir={dir}>
        
        {/* Header & Tabs */}
        <div className="bg-white border-b">
          <div className="flex items-center justify-between p-5 pb-4">
            <div>
              <h3 className="font-bold text-lg text-gray-900">{t('edit_user_settings', { defaultValue: 'إعدادات الموظف' })}</h3>
              <p className="text-sm text-[#00A89B] font-medium mt-0.5">{user.name}</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex px-5 gap-4">
            <button 
              onClick={() => setActiveTab('permissions')}
              className={clsx('pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors', activeTab === 'permissions' ? 'border-[#00A89B] text-[#00A89B]' : 'border-transparent text-gray-500 hover:text-gray-700')}
            >
              <ShieldAlert size={16} /> الصلاحيات
            </button>
            <button 
              onClick={() => setActiveTab('categories')}
              className={clsx('pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors', activeTab === 'categories' ? 'border-[#00A89B] text-[#00A89B]' : 'border-transparent text-gray-500 hover:text-gray-700')}
            >
              <Layers size={16} /> الأقسام المُسندة
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col gap-3 min-h-[250px] max-h-[60vh] overflow-y-auto">
          {activeTab === 'permissions' ? (
            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
              <ToggleSwitch label={t('perm_add_label')} desc={t('perm_add_desc')} checked={perms.can_add} onChange={() => togglePerm('can_add')} />
              <ToggleSwitch label={t('perm_delete_label')} desc={t('perm_delete_desc')} checked={perms.can_delete} onChange={() => togglePerm('can_delete')} />
              <ToggleSwitch label={t('perm_manage_label')} desc={t('perm_manage_desc')} checked={perms.can_edit_permissions} onChange={() => togglePerm('can_edit_permissions')} disabled={user.role !== 'admin'} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2">
              {categoriesList.map((c) => {
                const isActive = selectedCats.includes(c.value)
                return (
                  <button
                    key={c.value}
                    onClick={() => toggleCat(c.value)}
                    className={clsx(
                      'relative p-3 rounded-xl border-2 flex flex-col items-center gap-1 font-semibold text-sm transition-all duration-200',
                      isActive ? CATEGORY_ACTIVE[c.value] : CATEGORY_STYLES[c.value],
                      c.value === 'admin' && 'col-span-2'
                    )}
                  >
                    {isActive && <Check size={16} className="absolute top-2 right-2 opacity-70" />}
                    {c.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 bg-white border-t">
          <button
            onClick={handleSave}
            disabled={loading || selectedCats.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-[#00A89B] text-white py-3 rounded-xl font-semibold hover:bg-[#009287] shadow-lg shadow-[#00A89B]/20 transition-all disabled:opacity-50"
          >
            {loading ? <span className="animate-pulse">{t('saving', { defaultValue: 'جاري الحفظ...' })}</span> : <><Check size={18} /> {t('save')}</>}
          </button>
        </div>
      </div>
    </div>
  )
}