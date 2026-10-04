import { useEffect, useMemo, useState } from 'react'
import { adminService, issuesService, reportsService } from '@/services/api'
import { useAuth } from '@/store/AuthContext'
import { Trash2, ShieldCheck, ShieldOff, Users, AlertTriangle, Archive, UserCheck, Settings2, CheckCircle, XCircle, ArrowLeft, FileText, Download, Eye, Sparkles, CalendarRange } from 'lucide-react'
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
  const [dossiers, setDossiers] = useState([])
  const [loading, setLoading] = useState(true)
  const [dossierLoading, setDossierLoading] = useState(false)
  const [customReportOpen, setCustomReportOpen] = useState(false)
  const [customLoading, setCustomLoading] = useState(false)

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  const [reportFilters, setReportFilters] = useState({
    department: 'lab',
    year: currentYear,
    month: currentMonth,
  })
  const [customReport, setCustomReport] = useState({
    department: 'lab',
    startDate: `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`,
    endDate: new Date().toISOString().slice(0, 10),
  })

  const [selectedUser, setSelectedUser] = useState(null)
  const [approvingUser, setApprovingUser] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)

  const tabs = [
    { id: 'users', label: t('users'), icon: Users },
    { id: 'pending', label: t('join_requests'), icon: UserCheck },
    { id: 'issues', label: t('data'), icon: AlertTriangle },
    { id: 'archive', label: t('archive'), icon: Archive },
    { id: 'dossiers', label: t('official_dossiers'), icon: FileText },
  ]

  const catMap = {
    lab: { label: t('labs'), class: 'bg-purple-500/20 text-purple-700' },
    secondary_packaging: { label: t('secondary_packaging'), class: 'bg-orange-500/20 text-orange-700' },
    production: { label: t('production'), class: 'bg-blue-500/20 text-blue-700' },
    qc: { label: t('quality', { defaultValue: 'الجودة' }), class: 'bg-emerald-500/20 text-emerald-700' },
    admin: { label: t('admin'), class: 'bg-red-500/20 text-red-700' },
  }

  const yearOptions = useMemo(() => Array.from({ length: 5 }, (_, index) => currentYear - index), [currentYear])
  const monthOptions = useMemo(() => Array.from({ length: 12 }, (_, index) => index + 1), [])

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

  const loadDossiers = async () => {
    setDossierLoading(true)
    try {
      const data = await reportsService.getMonthlyReports(reportFilters)
      setDossiers(data)
    } catch (e) {
      console.error(e)
      setDossiers([])
    } finally {
      setDossierLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])
  useEffect(() => {
    if (tab === 'dossiers') {
      loadDossiers()
    }
  }, [tab, reportFilters.department, reportFilters.year, reportFilters.month])

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

  const handleApprove = async (categories) => {
    setActionLoading(approvingUser.id)
    try {
      await adminService.approveUser(approvingUser.id, categories)
      setApprovingUser(null)
      await loadData()
    } catch (err) {
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

  const handleGenerateMonthlyBatch = async () => {
    try {
      setDossierLoading(true)
      await reportsService.generateMonthlyBatch(reportFilters.year, reportFilters.month)
      await loadDossiers()
    } catch (error) {
      console.error(error)
    } finally {
      setDossierLoading(false)
    }
  }

  const fetchReportFile = async (report, disposition) => {
    if (!report?.id) throw new Error('Report file is unavailable')
    const apiBase = (import.meta.env.VITE_API_URL || 'https://factory-backend-jjqi.onrender.com').replace(/\/+$/, '')
    const token = localStorage.getItem('token')
    const response = await fetch(`${apiBase}/reports/monthly/${report.id}/file?disposition=${disposition}`, {
      headers: token ? { Authorization: 'Bearer ' + token } : {},
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Report file is unavailable' }))
      throw new Error(error.detail || 'Report file is unavailable')
    }
    return response.blob()
  }

  const previewReportFile = async (report) => {
    const previewWindow = window.open('', '_blank')
    if (!previewWindow) {
      console.error(new Error('Browser blocked the preview window'))
      return
    }
    try {
      const blob = await fetchReportFile(report, 'inline')
      const url = window.URL.createObjectURL(blob)
      previewWindow.location.href = url
      window.setTimeout(() => window.URL.revokeObjectURL(url), 60000)
    } catch (error) {
      previewWindow.close()
      console.error(error)
    }
  }

  const downloadReportFile = async (report) => {
    try {
      const blob = await fetchReportFile(report, 'attachment')
      const url = window.URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `${report.department}_${report.year}_${String(report.month).padStart(2, '0')}.pdf`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
    }
  }

  const handleCustomReport = async () => {
    setCustomLoading(true)
    try {
      await reportsService.customExport({
        department: customReport.department,
        startDate: customReport.startDate,
        endDate: customReport.endDate,
        language: i18n.language || 'ar',
      })
      setCustomReportOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setCustomLoading(false)
    }
  }

  const pendingUsers = users.filter(u => u.status === 'pending')
  const approvedUsers = users.filter(u => u.status === 'approved')

  return (
    <div className="flex flex-col gap-6 py-6">
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

      <div className="flex rounded-xl p-1 bg-gray-100 border border-gray-200 overflow-x-auto">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.id}
            onClick={() => setTab(tabItem.id)}
            className={clsx(
              'flex-1 min-w-[100px] py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-all rounded-lg',
              tab === tabItem.id ? 'bg-white text-[#00A89B] shadow-sm' : 'text-gray-500 hover:text-gray-900'
            )}
          >
            <tabItem.icon size={16} />
            {tabItem.label}
            {tabItem.id === 'pending' && pendingUsers.length > 0 && (
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => <div key={i} className="border rounded-xl h-20 bg-gray-100 animate-pulse" />)}
        </div>
      ) : tab === 'users' ? (
        <div className="flex flex-col gap-3">
          {approvedUsers.map((user) => {
            const isAdmin = user.role === 'admin'
            return (
              <div key={user.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shadow-sm hover:bg-gray-50/50 transition">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-full bg-teal-50 text-[#00A89B] flex items-center justify-center font-bold text-lg shrink-0">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-gray-900 truncate">{user.name}</span>
                    <span className="text-xs text-gray-500 truncate">{user.email}</span>
                  </div>

                  <div className="flex gap-1 flex-wrap ms-4">
                    <span className={clsx('text-[10px] px-2 py-1 rounded-md font-medium shrink-0 border', isAdmin ? 'bg-red-50 text-red-700 border-red-100' : 'bg-gray-50 text-gray-600 border-gray-200')}>
                      {isAdmin ? t('system_admin') : t('normal_user')}
                    </span>
                    {user.categories?.map(cat => (
                      <span key={cat} className={clsx('text-[10px] px-2 py-1 rounded-md font-medium shrink-0 border border-transparent', catMap[cat]?.class || 'bg-gray-100 text-gray-600')}>
                        {catMap[cat]?.label || cat}
                      </span>
                    ))}
                  </div>
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
                <div key={user.id} className="border rounded-2xl p-4 flex items-center justify-between bg-white shadow-sm">
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-sm truncate">{user.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => setApprovingUser(user)} disabled={busy} className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition disabled:opacity-50" title={t('approve')}>
                      <CheckCircle size={20} />
                    </button>
                    <button onClick={() => handleReject(user.id)} disabled={busy} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition disabled:opacity-50" title={t('reject')}>
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
              .map(issue => (
                <IssueCard key={issue.id} issue={issue} onUpdate={loadData} />
              ))
          )}
        </div>
      ) : tab === 'archive' ? (
        <div className="flex flex-col gap-3">
          {archivedIssues.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">{t('no_data')}</p>
          ) : (
            archivedIssues.map(issue => (
              <IssueCard key={issue.id} issue={issue} onUpdate={loadData} />
            ))
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <CalendarRange size={18} className="text-[#00A89B]" />
                <span>{t('official_dossiers')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleGenerateMonthlyBatch}
                  disabled={dossierLoading}
                  className="rounded-xl bg-[#00A89B] px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  {dossierLoading ? t('generating') : t('generate_monthly_dossiers')}
                </button>
                <button
                  onClick={() => setCustomReportOpen(true)}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700"
                >
                  {t('custom_report')}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <label className="flex flex-col gap-1 text-xs font-medium text-gray-600">
                {t('department')}
                <select
                  value={reportFilters.department}
                  onChange={(e) => setReportFilters((prev) => ({ ...prev, department: e.target.value }))}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                >
                  <option value="lab">{t('labs')}</option>
                  <option value="secondary_packaging">{t('secondary_packaging')}</option>
                  <option value="production">{t('production')}</option>
                </select>
              </label>

              <label className="flex flex-col gap-1 text-xs font-medium text-gray-600">
                {t('year')}
                <select
                  value={reportFilters.year}
                  onChange={(e) => setReportFilters((prev) => ({ ...prev, year: Number(e.target.value) }))}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-xs font-medium text-gray-600">
                {t('month')}
                <select
                  value={reportFilters.month}
                  onChange={(e) => setReportFilters((prev) => ({ ...prev, month: Number(e.target.value) }))}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                >
                  {monthOptions.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {dossierLoading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-44 animate-pulse rounded-2xl border border-gray-200 bg-gray-100" />
              ))}
            </div>
          ) : dossiers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
              {t('no_dossiers')}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {dossiers.map((report) => (
                <div key={report.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className={clsx('inline-flex rounded-full px-2 py-1 text-[10px] font-semibold', catMap[report.department]?.class || 'bg-gray-100 text-gray-600')}>
                        {catMap[report.department]?.label || report.department}
                      </span>
                      <h3 className="mt-3 text-lg font-bold text-gray-900">{report.title}</h3>
                    </div>
                    <Sparkles size={18} className="text-[#00A89B]" />
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <div>{t('month')}: {report.month}/{report.year}</div>
                    <div>{t('total_issues')}: {report.total_issues}</div>
                    <div>{t('open_issues')}: {report.open_issues}</div>
                    <div>{t('closed_issues')}: {report.closed_issues}</div>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button onClick={() => previewReportFile(report)} className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 flex items-center justify-center gap-2">
                      <Eye size={16} /> {t('preview')}
                    </button>
                    <button onClick={() => downloadReportFile(report)} className="flex-1 rounded-lg bg-[#00A89B] px-3 py-2 text-sm font-medium text-white flex items-center justify-center gap-2">
                      <Download size={16} /> {t('download')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
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

      {customReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{t('custom_report')}</h2>
              <button onClick={() => setCustomReportOpen(false)} className="text-gray-500">✕</button>
            </div>

            <div className="space-y-3">
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
                {t('department')}
                <select
                  value={customReport.department}
                  onChange={(e) => setCustomReport((prev) => ({ ...prev, department: e.target.value }))}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                >
                  <option value="lab">{t('labs')}</option>
                  <option value="secondary_packaging">{t('secondary_packaging')}</option>
                  <option value="production">{t('production')}</option>
                </select>
              </label>

              <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
                {t('start_date')}
                <input
                  type="date"
                  value={customReport.startDate}
                  onChange={(e) => setCustomReport((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
                {t('end_date')}
                <input
                  type="date"
                  value={customReport.endDate}
                  onChange={(e) => setCustomReport((prev) => ({ ...prev, endDate: e.target.value }))}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                />
              </label>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setCustomReportOpen(false)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
                {t('cancel')}
              </button>
              <button
                onClick={handleCustomReport}
                disabled={customLoading}
                className="rounded-lg bg-[#00A89B] px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {customLoading ? t('generating') : t('download')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}