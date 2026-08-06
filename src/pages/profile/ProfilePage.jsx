import { useEffect, useState } from 'react'
import { useAuth } from '@/store/AuthContext'
import { issuesService } from '@/services/api'
import IssueCard from '@/components/shared/IssueCard'
import { User as UserIcon, Mail, ShieldCheck, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMyIssues = async () => {
    try {
      const data = await issuesService.getAll(null, user.id)
      setIssues(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id) fetchMyIssues()
  }, [user])

  const openIssuesCount = issues.filter(i => i.status !== 'closed').length
  const closedIssuesCount = issues.filter(i => i.status === 'closed').length

  return (
    <div className="flex flex-col gap-6 py-4 pb-24">
      {/* Back button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-muted transition-colors"
          title={t('back')}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">{t('my_account')}</h1>
      </div>
      
      <div className="flex items-center gap-4 border rounded-2xl p-6 bg-card">
        <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center text-2xl font-bold">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div className="flex flex-col flex-1">
          <h1 className="text-xl font-bold flex items-center gap-2">
            {user?.name}
            {user?.role === 'admin' && <ShieldCheck size={18} className="text-purple-500" title={t('admin')} />}
          </h1>
          <span className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <Mail size={14} />
            {user?.email}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="border rounded-2xl p-4 flex flex-col items-center bg-card">
          <span className="text-2xl font-bold text-blue-500">{openIssuesCount}</span>
          <span className="text-xs text-muted-foreground">سجلات مفتوحة للمتابعة</span>
        </div>
        <div className="border rounded-2xl p-4 flex flex-col items-center bg-card">
          <span className="text-2xl font-bold text-gray-500">{closedIssuesCount}</span>
          <span className="text-xs text-muted-foreground">سجلات تم إغلاقها</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
          <h2 className="font-bold border-b pb-2">سجل المشاكل</h2>
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="border rounded-2xl h-64 bg-muted animate-pulse" />
            ))}
          </div>
        ) : issues.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">لم تقم بإضافة أي سجلات بعد.</p>
        ) : (
          issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} onUpdate={fetchMyIssues} />
          ))
        )}
      </div>
    </div>
  )
}
