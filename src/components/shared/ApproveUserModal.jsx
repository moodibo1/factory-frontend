import { X } from 'lucide-react'
import { clsx } from 'clsx'

const categories = [
  { value: 'lab', label: 'المختبرات', class: 'border-purple-500 text-purple-600 bg-purple-500/10 hover:bg-purple-500/20' },
  { value: 'filling', label: 'التعبئة', class: 'border-orange-500 text-orange-600 bg-orange-500/10 hover:bg-orange-500/20' },
  { value: 'production', label: 'الإنتاج', class: 'border-blue-500 text-blue-600 bg-blue-500/10 hover:bg-blue-500/20' },
  { value: 'admin', label: 'إدارة', class: 'border-red-500 text-red-600 bg-red-500/10 hover:bg-red-500/20' },
]

export default function ApproveUserModal({ user, onClose, onApprove }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-background border rounded-2xl shadow-xl flex flex-col overflow-hidden" dir="rtl">
        <div className="flex items-center justify-between p-4 border-b bg-muted/30">
          <div>
            <h3 className="font-bold">تصنيف المستخدم</h3>
            <p className="text-xs text-muted-foreground mt-0.5">يرجى تحديد قسم {user.name}</p>
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
                "py-4 rounded-xl border flex flex-col items-center justify-center transition font-semibold text-sm",
                c.class
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        
        <div className="p-4 pt-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-muted bg-background text-muted-foreground hover:bg-muted font-medium text-sm transition"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  )
}