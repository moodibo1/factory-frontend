import { useState, useRef } from 'react'
import { Sparkles, Search, X, Loader2 } from 'lucide-react'
import { issuesService } from '@/services/api'
import { useTranslation } from 'react-i18next'
import IssueCard from '@/components/shared/IssueCard'

export default function AISearchBar() {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef()

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setResults(null)
    try {
      const data = await issuesService.aiSearch(query)
      setResults(data)
    } catch (err) {
      setError(err.message || t('error'))
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setQuery('')
    setResults(null)
    setError('')
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Sparkles size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search_placeholder')}
            className="w-full bg-purple-500/5 border border-purple-500/20 rounded-xl pr-9 pl-9 py-2.5 text-sm outline-none focus:ring-2 ring-purple-500/40 placeholder:text-muted-foreground"
          />
          {query && (
            <button type="button" onClick={handleClear} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground rtl:left-3 rtl:right-auto ltr:right-3 ltr:left-auto">
              <X size={14} />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50 shrink-0"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
          {t('search')}
        </button>
      </form>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4 justify-center">
          <Loader2 size={16} className="animate-spin text-purple-500" />
          {t('loading')}
        </div>
      )}

      {error && <p className="text-sm text-destructive text-center">{error}</p>}

      {results !== null && !loading && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles size={14} className="text-purple-500" />
            {results.length > 0 ? `${t('search')} (${results.length})` : t('no_results')}
          </div>
          {results.map((issue) => (
            <IssueCard key={issue.id} issue={issue} onUpdate={() => {}} />
          ))}
        </div>
      )}
    </div>
  )
}
