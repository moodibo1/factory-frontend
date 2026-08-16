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
  const { t, i18n } = useTranslation()
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
    if (!confirm(t('confirm_delete') || 'هل أنت متأكد من الحذف؟')) return
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
    <div className="flex flex-col gap-6 py-6">
      {/* Back button and header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          title={t('back')}
        >
          <ArrowLeft size={20} className="rtl:rotate-0 ltr:rotate-180" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{t('management')}</h1>
      </div>

      <div className="flex rounded-xl p-1 bg-gray-100 border border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={clsx(
              'flex-1 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-all rounded-lg',
              tab === t.id ? 'bg-white text-[#00A89B] shadow-sm' : 'text-gray-500 hover:text-gray-900'
            )}
          >
            <t.icon size={16} />
            {t.label}
            {t.id === 'pending' && pendingUsers.length > 0 && (
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1,2,3].map(i => <div key={i} className="border rounded-xl h-20 bg-gray-100 animate-pulse" />)}
        </div>
      ) : tab === 'users' ? (
            <div className="flex flex-col gap-3">
              {approvedUsers.map((user) => {
                const isMe = user.id === currentUser?.id
                const isAdmin = user.role === 'admin'
                const busy = actionLoading === user.id
                return (
                  <div key={user.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shadow-sm hover:bg-gray-50/50 transition">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-teal-50 text-[#00A89B] flex items-center justify-center font-bold text-lg shrink-0">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-gray-900 truncate">{user.name}</span>
                        <span className="text-xs text-gray-500 truncate">{user.email}</span>
                      </div>
                      <span className={clsx('text-xs px-2.5 py-1 rounded-full font-medium shrink-0', isAdmin ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600')}>
                        {isAdmin ? t('system_admin') : t('normal_user')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => setSelectedUser(user)} className="p-2 text-gray-400 hover:text-[#00A89B] transition rounded-lg hover:bg-gray-100"><Settings2 size={18} /></button>
                      <button onClick={() => handleRoleToggle(user)} className="p-2 text-gray-400 hover:text-purple-600 transition rounded-lg hover:bg-gray-100">{isAdmin ? <ShieldOff size={18} /> : <ShieldCheck size={18} />}</button>
                      <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-gray-400 hover:text-red-600 transition rounded-lg hover:bg-gray-100"><Trash2 size={18} /></button>
                    </div>
                  </div>
                )
              })}
            </div>
      ) : tab === 'pending' ? (
        <div className="flex flex-col gap-3">
          {pendingUsers.length === 0 ? (
            <p className="text-center text-muted-foreground py-10 text-sm">{t('no_data')}</p>
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
                    <button onClick={() => setApprovingUser(user)} disabled={busy} className="p-2 text-green-600 hover:bg-green-600/10 rounded-xl transition disabled:opacity-50" title={t('approve')}>
                      <CheckCircle size={20} />
                    </button>
                    <button onClick={() => handleReject(user.id)} disabled={busy} className="p-2 text-destructive hover:bg-destructive/10 rounded-xl transition disabled:opacity-50" title={t('reject')}>
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
            <p className="text-center text-muted-foreground py-10">{t('no_data')}</p>
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
            <p className="text-center text-muted-foreground py-10">{t('no_data')}</p>
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
