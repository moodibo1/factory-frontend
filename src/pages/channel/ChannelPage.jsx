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
  const [isInitializing, setIsInitializing] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
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

  const fetchIssues = useCallback(async (silent = false) => {
    if (!silent) setIsInitializing(true)
    else setIsRefreshing(true)
    try {
      const responses = await Promise.all([
        issuesService.getAll(id, null, page, limit),
        issuesService.getCount(id, null)
      ])
      setIssues(responses[0])
      setTotal(responses[1].total)
    } catch (e) {
      console.error(e)
    } finally {
      setIsInitializing(false)
      setIsRefreshing(false)
    }
  }, [id, page, limit])

  useEffect(() => {
    fetchIssues(false)
    const interval = setInterval(() => fetchIssues(true), 15000)
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
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="d1-fade-in-up flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-90"
            title={t('back')}
          >
            <ArrowLeft size={20} className="rtl:rotate-0 ltr:rotate-180" />
          </button>
          <h1 className="text-xl font-extrabold tracking-tight">
            {categoryNames[id] || id}
            {isRefreshing && <span className="text-[10px] text-[#00A89B] ml-2 animate-pulse">{t('updating')}...</span>}
          </h1>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
          {filtered.length} {t('records')}
        </span>
      </div>

      {/* ── Search & Filter ─────────────────────────────────── */}
      <div className="d1-fade-in-up d1-stagger-1 flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`${t('search')}...`}
            className="w-full bg-white border border-gray-100 rounded-xl pr-9 pl-4 py-2.5 text-sm outline-none focus:ring-2 ring-[#00A89B]/20 focus:border-[#00A89B]/30 transition-all rtl:pr-9 rtl:pl-4 ltr:pl-9 ltr:pr-4 shadow-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition rtl:left-3 ltr:right-3 ltr:left-auto active:scale-90">
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilter((v) => !v)}
          className={clsx(
            'p-2.5 rounded-xl border transition-all duration-200 active:scale-90',
            hasFilters
              ? 'bg-[#00A89B] text-white border-[#00A89B] shadow-md shadow-[#00A89B]/20'
              : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200 shadow-sm'
          )}
        >
          <SlidersHorizontal size={17} />
        </button>
      </div>

      {/* ── Filter Panel ────────────────────────────────────── */}
      {showFilter && (
        <div className="flex flex-col gap-3 border border-gray-100 rounded-2xl p-4 bg-white shadow-sm d1-fade-in-up">
          <div>
            <p className="text-xs text-gray-400 mb-2 font-medium">{t('report_type')}</p>
            <div className="flex gap-2 flex-wrap">
              {typeOptions.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setType(o.value)}
                  className={clsx(
                    'text-xs px-3 py-1.5 rounded-xl border transition-all duration-200 active:scale-95',
                    type === o.value
                      ? 'bg-[#00A89B] text-white border-[#00A89B]'
                      : 'text-gray-500 border-gray-200 hover:border-[#00A89B]/40'
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-2 font-medium">{t('status')}</p>
            <div className="flex gap-2 flex-wrap">
              {statusOptions.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setStatus(o.value)}
                  className={clsx(
                    'text-xs px-3 py-1.5 rounded-xl border transition-all duration-200 active:scale-95',
                    status === o.value
                      ? 'bg-[#00A89B] text-white border-[#00A89B]'
                      : 'text-gray-500 border-gray-200 hover:border-[#00A89B]/40'
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full h-px bg-gray-100 my-1" />
          <div>
            <p className="text-xs text-gray-400 mb-2 flex items-center gap-1 font-medium">
              <ArrowDownWideNarrow size={14} /> {t('sort')}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-[#00A89B]/20 transition cursor-pointer"
            >
              <option value="date_desc">{t('sort_newest')}</option>
              <option value="date_asc">{t('sort_oldest')}</option>
              <option value="type">{t('sort_emergency')}</option>
              <option value="alpha_asc">A - Z</option>
              <option value="alpha_desc">Z - A</option>
            </select>
          </div>
          {hasFilters && (
            <button onClick={() => { setType(''); setStatus('') }} className="text-xs text-red-500 text-right mt-1 rtl:text-right ltr:text-left hover:text-red-600 transition active:scale-95">
              {t('clear_filters')}
            </button>
          )}
        </div>
      )}

      {/* ── Issues List ─────────────────────────────────────── */}
      {isInitializing ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="d1-skeleton h-64" style={{ animationDelay: `${i * 0.05}s` }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-gray-300 d1-fade-in-up">
          <Search size={40} strokeWidth={1} />
          <p className="text-sm text-gray-400">{t('no_results')}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((issue, i) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onUpdate={fetchIssues}
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      )}

      {/* ── Pagination ──────────────────────────────────────── */}
      {total > limit && (
        <div className="flex items-center justify-center gap-2 mt-4 d1-fade-in-up">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm transition-all active:scale-95 shadow-sm"
          >
            {t('previous')}
          </button>
          <span className="text-sm text-gray-400 px-2">
            {t('page', { current: page, total: Math.ceil(total / limit) })}
          </span>
          <button
            onClick={() => setPage(p => Math.min(Math.ceil(total / limit), p + 1))}
            disabled={page === Math.ceil(total / limit)}
            className="px-4 py-2 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm transition-all active:scale-95 shadow-sm"
          >
            {t('next')}
          </button>
        </div>
      )}

      {/* ── Floating Add Button ─────────────────────────────── */}
      {userPerms.can_add && (
        <button
          onClick={() => setShowModal(true)}
          className="fixed left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#00A89B] text-white px-6 py-3.5 rounded-2xl shadow-lg shadow-[#00A89B]/25 hover:shadow-xl hover:shadow-[#00A89B]/30 hover:scale-105 active:scale-95 transition-all duration-300 font-semibold z-50 mb-[4.5rem] sm:mb-6"
          style={{ bottom: 'env(safe-area-inset-bottom, 0px)' }}
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
