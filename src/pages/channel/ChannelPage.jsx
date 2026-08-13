import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { issuesService } from '@/services/api'
import IssueCard from '@/components/shared/IssueCard'
import AddIssueModal from '@/components/shared/AddIssueModal'
import { Plus, Search, SlidersHorizontal, X, ArrowDownWideNarrow, ArrowLeft } from 'lucide-react'
import { clsx } from 'clsx'
import { useAuth } from '@/store/AuthContext'
import { useTranslation } from 'react-i18next'

export default function ChannelPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [issues, setIssues] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [sortBy, setSortBy] = useState('date_desc')
  const [showFilter, setShowFilter] = useState(false)

  const { user } = useAuth()
  const userPerms = (() => {
    try { return JSON.parse(user?.permissions || '{}') }
    catch { return { can_add: true } }
  })()
  
  // Category names with translations
  const categoryNames = {
    lab: t('labs'),
    filling: t('filling'),
    production: t('production'),
  }
  
  // Type options with translations
  const typeOptions = [
    { value: '', label: t('all') || 'الكل' },
    { value: 'problem', label: t('problem') },
    { value: 'note', label: t('note') },
    { value: 'emergency', label: t('emergency') },
  ]

  // Status options with translations
  const statusOptions = [
    { value: '', label: t('all') || 'الكل' },
    { value: 'open', label: t('open') },
    { value: 'in_progress', label: t('in_progress') },
    { value: 'closed', label: t('closed') },
    { value: 'reopened', label: t('reopened') },
  ]

  const fetchIssues = useCallback(async () => {
    setLoading(true)
    try {
      const [data, countData] = await Promise.all([
        issuesService.getAll(id, null, page, limit),
        issuesService.getCount(id, null)
      ])
      setIssues(data)
      setTotal(countData.total)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [id, page, limit])

  useEffect(() => {
    fetchIssues()
    const interval = setInterval(fetchIssues, 15000)
    return () => clearInterval(interval)
  }, [fetchIssues])

  const filtered = issues.filter((i) => {
    const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase()) || i.description?.toLowerCase().includes(search.toLowerCase())
    const matchType = !type || i.type === type
    const matchStatus = status ? i.status === status : i.status !== 'closed'
    return matchSearch && matchType && matchStatus
  }).sort((a, b) => {
    if (sortBy === 'date_desc') return new Date(b.created_at) - new Date(a.created_at)
    if (sortBy === 'date_asc') return new Date(a.created_at) - new Date(b.created_at)
    if (sortBy === 'alpha_asc') return a.title.localeCompare(b.title, 'ar')
    if (sortBy === 'alpha_desc') return b.title.localeCompare(a.title, 'ar')
    if (sortBy === 'type') {
      const typeRank = { emergency: 1, problem: 2, note: 3 }
      return typeRank[a.type] - typeRank[b.type]
    }
    return 0
  })

  const hasFilters = type || status

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
            title={t('back')}
          >
            <ArrowLeft size={20} className="rtl:rotate-0 ltr:rotate-180" />
          </button>
          <h1 className="text-xl font-bold">{categoryNames[id] || id}</h1>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {filtered.length} {t('records')}
        </span>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`${t('search')}...`}
            className="w-full bg-muted rounded-xl pr-9 pl-4 py-2.5 text-sm outline-none focus:ring-2 ring-primary rtl:pr-9 rtl:pl-4 ltr:pl-9 ltr:pr-4"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilter((v) => !v)}
          className={clsx(
            'p-2.5 rounded-xl border transition',
            hasFilters ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-transparent'
          )}
        >
          <SlidersHorizontal size={17} />
        </button>
      </div>

      {showFilter && (
        <div className="flex flex-col gap-3 border rounded-2xl p-4 bg-card">
          <div>
            <p className="text-xs text-muted-foreground mb-2">النوع</p>
            <div className="flex gap-2 flex-wrap">
              {typeOptions.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setType(o.value)}
                  className={clsx(
                    'text-xs px-3 py-1.5 rounded-full border transition',
                    type === o.value ? 'bg-primary text-primary-foreground border-primary' : 'text-muted-foreground'
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">الحالة</p>
            <div className="flex gap-2 flex-wrap">
              {statusOptions.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setStatus(o.value)}
                  className={clsx(
                    'text-xs px-3 py-1.5 rounded-full border transition',
                    status === o.value ? 'bg-primary text-primary-foreground border-primary' : 'text-muted-foreground'
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full h-px bg-muted my-1" />
          <div>
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <ArrowDownWideNarrow size={14} /> {t('sort')}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-muted border border-transparent rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-primary transition cursor-pointer"
            >
              <option value="date_desc">{t('sort_newest')}</option>
              <option value="date_asc">{t('sort_oldest')}</option>
              <option value="type">{t('sort_emergency')}</option>
              <option value="alpha_asc">A - Z</option>
              <option value="alpha_desc">Z - A</option>
            </select>
          </div>
          {hasFilters && (
            <button onClick={() => { setType(''); setStatus('') }} className="text-xs text-destructive text-right mt-2 rtl:text-right ltr:text-left">
              {t('clear_filters')}
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-2xl h-64 bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
          <Search size={36} strokeWidth={1.2} />
          <p className="text-sm">{t('no_results')}</p>
        </div>
      ) : (
        filtered.map((issue) => (
          <IssueCard key={issue.id} issue={issue} onUpdate={fetchIssues} />
        ))
      )}

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg border border-muted hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          >
            {t('previous')}
          </button>
          <span className="text-sm text-muted-foreground">
            {t('page', { current: page, total: Math.ceil(total / limit) })}
          </span>
          <button
            onClick={() => setPage(p => Math.min(Math.ceil(total / limit), p + 1))}
            disabled={page === Math.ceil(total / limit)}
            className="px-3 py-1.5 rounded-lg border border-muted hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          >
            {t('next')}
          </button>
        </div>
      )}

      {userPerms.can_add && (
        <button
          onClick={() => setShowModal(true)}
          className="fixed left-1/2 -translate-x-1/2 flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg hover:opacity-90 transition font-medium z-30"
          style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
        >
          <Plus size={20} />
          {t('add')}
        </button>
      )}

      {showModal && (
        <AddIssueModal onClose={() => setShowModal(false)} onSuccess={fetchIssues} />
      )}
    </div>
  )
}
