import { useEffect, useState } from 'react'
import { adminService, issuesService } from '@/services/api'
import { useAuth } from '@/store/AuthContext'
import { Trash2, ShieldCheck, ShieldOff, Users, AlertTriangle, Archive, UserCheck, Settings2, Crown, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import { clsx } from 'clsx'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import IssueCard from '@/components/shared/IssueCard'
import PermissionsModal from '@/components/shared/PermissionsModal'
import ApproveUserModal from '@/components/shared/ApproveUserModal'

export default function AdminPage() {
  const { user: currentUser } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [tab, setTab] = useState('users')
  const [users, setUsers] = useState([])
  const [issues, setIssues] = useState([])
  const [archivedIssues, setArchivedIssues] = useState([])
  const [loading, setLoading] = useState(true)

  // Permissions & Approval Modal state
  const [selectedUser, setSelectedUser] = useState(null)
  const [approvingUser, setApprovingUser] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  
  // Tabs with translations
  const tabs = [
    { id: 'users', label: t('users'), icon: Users },
    { id: 'pending', label: t('join_requests'), icon: UserCheck },
    { id: 'issues', label: t('data'), icon: AlertTriangle },
    { id: 'archive', label: t('archive'), icon: Archive },
  ]
  
  // Category map with translations
  const catMap = {
    lab: { label: t('labs'), class: 'bg-purple-500/20 text-purple-500' },
    labs: { label: t('labs'), class: 'bg-purple-500/20 text-purple-500' }, // Fallback
    filling: { label: t('filling'), class: 'bg-orange-500/20 text-orange-500' },
    production: { label: t('production'), class: 'bg-blue-500/20 text-blue-500' },
    admin: { label: t('admin'), class: 'bg-red-500/20 text-red-500' },
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const [u, i, a] = await Promise.all([
        adminService.getUsers(),
        issuesService.getAll(),
        adminService.getArchivedIssues(),
      ])
      setUsers(u)
      setIssues(i)
      setArchivedIssues(a)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleRoleToggle = async (user) => {
    setActionLoading(user.id)
    try {
      const newRole = user.role === 'admin' ? 'user' : 'admin'
      await adminService.updateRole(user.id, newRole)
      await loadData()
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return
    setActionLoading(userId)
    try {
      await adminService.deleteUser(userId)
      await loadData()
    } finally {
      setActionLoading(null)
    }
  }

  const handleApprove = async (category) => {
    setActionLoading(approvingUser.id)
    try {
      await adminService.approveUser(approvingUser.id, category)
      setApprovingUser(null)
      await loadData()
    } catch(err) {
      console.error(err)
      setActionLoading(null)
    }
  }

  const handleReject = async (userId) => {
    setActionLoading(userId)
    try {
      await adminService.rejectUser(userId)
      await loadData()
    } finally {
      setActionLoading(null)
    }
  }

  const pendingUsers = users.filter(u => u.status === 'pending')
  const approvedUsers = users.filter(u => u.status === 'approved')

  return (
    <div className="flex flex-col gap-4 py-4 pb-24">
      {/* Back button and header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-muted transition-colors"
          title={t('back')}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">{t('management')}</h1>
      </div>

      <div className="flex rounded-xl overflow-hidden border bg-card">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={clsx(
              'relative flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 transition',
              tab === t.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/50'
            )}
          >
            <t.icon size={15} />
            {t.label}
            {t.id === 'pending' && pendingUsers.length > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1,2,3].map(i => <div key={i} className="border rounded-2xl h-16 bg-muted animate-pulse" />)}
        </div>
      ) : tab === 'users' ? (
        <div className="flex flex-col gap-3">
          {approvedUsers.map((user) => {
            const isMe = user.id === currentUser?.id
            const isAdmin = user.role === 'admin'
            const busy = actionLoading === user.id

            return (
              <div key={user.id} className="border rounded-2xl p-4 flex items-center justify-between bg-background">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-sm truncate">{user.name}</span>
                    {isMe && <span className="text-xs text-muted-foreground">(أنت)</span>}
                    {isAdmin && <Crown size={12} className="text-purple-500 shrink-0" />}
                  </div>
                  <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                  <div className="flex items-center gap-1 mt-1">
                    {user.category && catMap[user.category] && (
                      <span className={clsx('text-[10px] px-2 py-0.5 rounded-full w-fit', catMap[user.category].class)}>
                        {catMap[user.category].label}
                      </span>
                    )}
                    <span className={clsx(
                      'text-[10px] px-2 py-0.5 rounded-full w-fit',
                      isAdmin ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-muted text-muted-foreground'
                    )}>
                      {isAdmin ? 'مدير النظام' : 'مستخدم عادي'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setSelectedUser(user)}
                    disabled={busy}
                    className="p-2 rounded-xl text-blue-500 hover:bg-blue-500/10 transition disabled:opacity-40"
                    title="تعديل الصلاحيات الدقيقة"
                  >
                    <Settings2 size={17} />
                  </button>
                  {!isMe && (
                    <>
                      <button
                        onClick={() => handleRoleToggle(user)}
                        disabled={busy}
                        className={clsx(
                          'p-2 rounded-xl transition disabled:opacity-40',
                          user.role === 'admin' ? 'text-purple-500 hover:bg-purple-500/20' : 'text-muted-foreground hover:bg-muted'
                        )}
                        title={user.role === 'admin' ? 'إزالة صلاحيات المدير' : 'منح صلاحيات المدير'}
                      >
                        {user.role === 'admin' ? <ShieldOff size={17} /> : <ShieldCheck size={17} />}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={busy}
                        className="p-2 rounded-xl text-destructive hover:bg-destructive/10 transition disabled:opacity-40"
                        title="حذف المستخدم"
                      >
                        <Trash2 size={17} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : tab === 'pending' ? (
        <div className="flex flex-col gap-3">
          {pendingUsers.length === 0 ? (
            <p className="text-center text-muted-foreground py-10 text-sm">لا توجد طلبات انضمام معلقة</p>
          ) : (
            pendingUsers.map(user => {
              const busy = actionLoading === user.id
              return (
                <div key={user.id} className="border rounded-2xl p-4 flex items-center justify-between bg-background">
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-sm truncate">{user.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                  </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => setApprovingUser(user)} disabled={busy} className="p-2 text-green-600 hover:bg-green-600/10 rounded-xl transition disabled:opacity-50" title="موافقة">
                        <CheckCircle size={20} />
                      </button>
                    <button onClick={() => handleReject(user.id)} disabled={busy} className="p-2 text-destructive hover:bg-destructive/10 rounded-xl transition disabled:opacity-50" title="رفض">
                      <XCircle size={20} />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      ) : tab === 'issues' ? (
        <div className="flex flex-col gap-3">
          {issues.filter(issue => issue.status === 'closed').length === 0 ? (
            <p className="text-center text-muted-foreground py-10">لا توجد سجلات مغلقة حالياً.</p>
          ) : (
            issues
              .filter(issue => issue.status === 'closed')
              .map((issue) => (
                <IssueCard key={issue.id} issue={issue} onUpdate={loadData} />
              ))
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {archivedIssues.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">السجلات المؤرشفة فارغة.</p>
          ) : (
            archivedIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} onUpdate={loadData} />
            ))
          )}
        </div>
      )}

      {selectedUser && (
        <PermissionsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={loadData}
        />
      )}

      {approvingUser && (
        <ApproveUserModal
          user={approvingUser}
          onClose={() => setApprovingUser(null)}
          onApprove={handleApprove}
        />
      )}
    </div>
  )
}

