import { useEffect, useState } from 'react'
import { dashboardService, issuesService } from '@/services/api'
import { AlertTriangle, CheckCircle, Clock, TrendingUp, Download, Printer, Sparkles, Copy, Check, Calendar, X, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

const COLORS = ['#ef4444', '#f97316', '#eab308']

export default function DashboardPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [stats, setStats] = useState(null)
  const [recentIssues, setRecentIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [aiReport, setAiReport] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Excel Modal States
  const [showExcelModal, setShowExcelModal] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [customPrompt, setCustomPrompt] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [s, issues] = await Promise.all([
          dashboardService.getStats(),
          issuesService.getAll(),
        ])
        setStats(s)
        setRecentIssues(issues.slice(0, 5))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleExport = async (e) => {
    e.preventDefault()
    setExporting(true)
    try {
      await dashboardService.exportReport(startDate, endDate)
      setShowExcelModal(false)
      setStartDate('')
      setEndDate('')
    } catch {
      alert('فشل التصدير')
    } finally {
      setExporting(false)
    }
  }

  const handleAiReport = async (promptValue = '') => {
    setAiLoading(true)
    setAiReport('')
    try {
      const data = await dashboardService.getAiReport(promptValue)
      setAiReport(data.report)
    } catch {
      setAiReport('فشل توليد التقرير. تأكد من صحة الـ API Key.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(aiReport)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="flex flex-col gap-4 py-4">
      {[1,2,3].map(i => <div key={i} className="border rounded-2xl h-32 bg-muted animate-pulse" />)}
    </div>
  )

  if (!stats) return <p className="text-center py-10 text-muted-foreground">تعذر تحميل البيانات</p>

  const kpis = [
    { label: t('total_records'), value: stats.total, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: t('open_records'), value: stats.open, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: t('closed_records'), value: stats.closed, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: t('emergencies'), value: stats.emergency, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
  ]

  const barData = [
    { name: t('labs'), count: stats.by_category.lab },
    { name: t('filling'), count: stats.by_category.filling },
    { name: t('production'), count: stats.by_category.production },
  ]

  const pieData = [
    { name: t('critical'), value: stats.emergency },
    { name: t('main'), value: stats.open - stats.emergency },
    { name: t('secondary'), value: stats.total - stats.open },
  ].filter(d => d.value > 0)

  return (
    <div className="flex flex-col gap-6 py-4 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
            title={t('back')}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">{t('reports')}</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="p-2 bg-muted rounded-xl text-muted-foreground hover:text-foreground transition" title={t('print')}>
            <Printer size={20} />
          </button>
          <button onClick={() => setShowExcelModal(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600/10 text-green-600 border border-green-600/20 rounded-xl hover:bg-green-600 hover:text-white transition font-medium text-sm">
            <Download size={16} />
            {t('export_excel')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`rounded-2xl p-4 flex flex-col gap-2 ${kpi.bg} border`}>
            <div className={kpi.color}><kpi.icon size={22} /></div>
            <span className="text-2xl font-bold">{kpi.value}</span>
            <span className="text-xs text-muted-foreground">{kpi.label}</span>
          </div>
        ))}
      </div>

      <div className="border rounded-2xl p-4 flex flex-col gap-3">
        <h2 className="font-semibold text-sm text-muted-foreground">{t('issues_by_department')}</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} name={t('records') || "سجلات"} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {pieData.length > 0 && (
        <div className="border rounded-2xl p-4 flex flex-col gap-3">
          <h2 className="font-semibold text-sm text-muted-foreground">{t('severity_distribution')}</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="border rounded-2xl p-4 flex flex-col gap-3">
        <h2 className="font-semibold text-sm text-muted-foreground">{t('latest_issues')}</h2>
        <div className="flex flex-col gap-2">
          {recentIssues.map((issue) => (
            <div key={issue.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
              <span className="font-medium truncate max-w-[60%]">{issue.title}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${issue.status === 'open' ? 'bg-blue-500/20 text-blue-500' : 'bg-gray-500/20 text-gray-400'}`}>
                {t(issue.status === 'in_progress' ? 'in_progress' : issue.status)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-2 border-dashed border-purple-500/30 rounded-2xl p-4 flex flex-col gap-4 bg-purple-500/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-purple-500" />
            <h2 className="font-bold">{t('smart_reports_tool')}</h2>
          </div>
          {aiReport && (
            <button onClick={handleCopy} className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition">
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              {copied ? t('success') : t('copy')}
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs text-muted-foreground font-semibold">{t('generate_quick_report')}</p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleAiReport('')}
              disabled={aiLoading}
              className="text-xs px-3 py-2 bg-purple-500/10 text-purple-600 rounded-xl border border-purple-500/20 hover:bg-purple-600 hover:text-white transition disabled:opacity-50"
            >
              📊 {t('current_factory_status')}
            </button>
            <button
              onClick={() => handleAiReport(t('monthly_performance'))}
              disabled={aiLoading}
              className="text-xs px-3 py-2 bg-purple-500/10 text-purple-600 rounded-xl border border-purple-500/20 hover:bg-purple-600 hover:text-white transition disabled:opacity-50"
            >
              📅 {t('monthly_performance')}
            </button>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleAiReport(customPrompt) }} className="flex gap-2">
          <input
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            disabled={aiLoading}
            placeholder={t('custom_query')}
            className="flex-1 bg-background border border-purple-500/20 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 ring-purple-500/40 placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={aiLoading || !customPrompt.trim()}
            className="bg-purple-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
          >
            {t('query_button')}
          </button>
        </form>

        {aiLoading && (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">{t('loading')}</p>
          </div>
        )}

        {aiReport && !aiLoading && (
          <div className="flex flex-col gap-4">
            <div className="bg-background rounded-xl p-4 text-xs leading-relaxed whitespace-pre-wrap border select-text">
              {aiReport}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-xl text-xs hover:text-foreground transition"
              >
                <Printer size={15} />
                {t('print')}
              </button>
            </div>
          </div>
        )}
      </div>

      {showExcelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowExcelModal(false)} />
          <div className="relative w-full max-w-sm bg-background border rounded-2xl shadow-xl flex flex-col overflow-hidden" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="flex items-center justify-between p-4 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-primary" />
                <h3 className="font-bold">{t('export_excel')}</h3>
              </div>
              <button onClick={() => setShowExcelModal(false)} className="p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleExport} className="p-4 flex flex-col gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">From Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-muted border border-transparent rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-primary transition cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">To Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-muted border border-transparent rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-primary transition cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={exporting}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition"
              >
                <Download size={18} />
                {exporting ? t('loading') : t('export_excel')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

