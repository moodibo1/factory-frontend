import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { adminService } from '@/services/api'
import { clsx } from 'clsx'

export default function PermissionsModal({ user, onClose, onSave }) {
  const [perms, setPerms] = useState(() => {
    try {
      return JSON.parse(user.permissions || '{}')
    } catch {
      return { can_add: true, can_delete: false, can_edit_permissions: false }
    }
  })
  const [loading, setLoading] = useState(false)

  const togglePerm = (key) => {
    setPerms(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await adminService.updatePermissions(user.id, JSON.stringify(perms))
      onSave()
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const ToggleSwitch = ({ label, desc, checked, onChange, disabled }) => (
    <div className={clsx("flex items-center justify-between p-3 border rounded-xl", disabled && "opacity-50 pointer-events-none")}>
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-sm">{label}</span>
        <span className="text-xs text-muted-foreground">{desc}</span>
      </div>
      <button
        onClick={onChange}
        disabled={disabled}
        className={clsx(
          "relative w-12 h-6 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted-foreground/30"
        )}
      >
        <div className={clsx(
          "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
          checked ? "left-1 translate-x-0" : "left-7"
        )} />
      </button>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-background border rounded-2xl shadow-xl flex flex-col overflow-hidden" dir="rtl">
        <div className="flex items-center justify-between p-4 border-b bg-muted/30">
          <div>
            <h3 className="font-bold">تعديل صلاحيات المستخدم</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{user.name} ({user.email})</p>
          </div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 flex flex-col gap-3">
          <ToggleSwitch
            label="صلاحية الإضافة"
            desc="السماح بإنشاء سجلات جديدة في النظام"
            checked={perms.can_add}
            onChange={() => togglePerm('can_add')}
          />
          <ToggleSwitch
            label="صلاحية الحذف"
            desc="السماح بحذف السجلات والتعليقات الخاصة به"
            checked={perms.can_delete}
            onChange={() => togglePerm('can_delete')}
          />
          <ToggleSwitch
            label="صلاحية إدارة الأذونات"
            desc="إعطاء صلاحية لتعديل حسابات المستخدمين الآخرين"
            checked={perms.can_edit_permissions}
            onChange={() => togglePerm('can_edit_permissions')}
            disabled={user.role !== 'admin'}
          />
          
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 mt-4 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? 'جاري الحفظ...' : (
              <>
                <Check size={18} />
                حفظ التغييرات
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
