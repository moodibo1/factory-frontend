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
  const { t, i18n } = useTranslation()
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
      alert(t('loading_failed'))
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
      setAiReport(t('ai_report_failed'))
    } finally {
      setAiLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(aiReport)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /* ── Loading Skeleton ──────────────────────────────────── */
  if (loading) return (
    <div className="flex flex-col gap-4 py-4">
      <div className="d1-skeleton h-14 w-full" />
      <div className="grid grid-cols-2 gap-3">
        {[1,2,3,4].map(i => <div key={i} className="d1-skeleton h-32" style={{ animationDelay: `${i * 0.08}s` }} />)}
      </div>
      <div className="d1-skeleton h-56" style={{ animationDelay: '0.3s' }} />
    </div>
  )

  if (!stats) return <p className="text-center py-10 text-gray-400">{t('loading_failed')}</p>

  const kpis = [
    { label: t('total_records'), value: stats.total, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/8', iconBg: 'bg-blue-50' },
    { label: t('open_records'), value: stats.open, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/8', iconBg: 'bg-amber-50' },
    { label: t('closed_records'), value: stats.closed, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/8', iconBg: 'bg-emerald-50' },
    { label: t('emergencies'), value: stats.emergency, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/8', iconBg: 'bg-red-50' },
  ]

  const barData = [
    { name: t('labs'), count: stats.by_category.lab },
    { name: t('filling'), count: stats.by_category.filling },
    { name: t('production'), count: stats.by_category.production },
  ]

  const pieData = [
    { name: t('critical'), value: stats.emergency },
    { name: t('main'), value: stats.open - stats.emergency },
  ].filter(d => d.value > 0)

  const dir = i18n.language === 'ar' ? 'rtl' : 'ltr'

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="d1-fade-in-up flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-90"
            title={t('back')}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-extrabold tracking-tight">{t('reports')}</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-gray-600 hover:border-gray-200 transition-all active:scale-90 shadow-sm" title={t('print')}>
            <Printer size={18} />
          </button>
          <button onClick={() => setShowExcelModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-200 font-medium text-sm active:scale-95 shadow-sm">
            <Download size={16} />
            {t('export_excel')}
          </button>
        </div>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.label}
            className={`d1-fade-in-up d1-stagger-${i + 1} group rounded-2xl p-5 flex flex-col gap-3 bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}
          >
            {/* Oversized icon in container */}
            <div className={`w-12 h-12 rounded-2xl ${kpi.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
              <kpi.icon size={24} className={kpi.color} strokeWidth={1.8} />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-3xl font-extrabold tracking-tight text-gray-900">{kpi.value}</span>
              <span className="text-xs text-gray-400 font-medium">{kpi.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bar Chart ──────────────────────────────────────── */}
      <div className="d1-fade-in-up d1-stagger-5 bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
        <h2 className="font-bold text-sm text-gray-600">{t('issues_by_department')}</h2>
        <div className="w-full" style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#94a3b8' }} width={30} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #f1f5f9', fontSize: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }} />
              <Bar dataKey="count" fill="#00A89B" radius={[8, 8, 0, 0]} name={t('count')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Pie Chart ──────────────────────────────────────── */}
      {pieData.length > 0 && (
        <div className="d1-fade-in-up d1-stagger-6 bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
          <h2 className="font-bold text-sm text-gray-600">{t('severity_distribution')}</h2>
          <div className="w-full" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #f1f5f9', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Latest Issues ──────────────────────────────────── */}
      <div className="d1-fade-in-up bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
        <h2 className="font-bold text-sm text-gray-600">{t('latest_issues')}</h2>
        <div className="flex flex-col">
          {recentIssues.map((issue, i) => (
            <div key={issue.id} className={`flex items-center justify-between text-sm py-3 transition-colors hover:bg-gray-50/50 rounded-xl px-2 -mx-2 ${i < recentIssues.length - 1 ? 'border-b border-gray-50' : ''}`}>
              <span className="font-medium truncate max-w-[60%] text-gray-700">{issue.title}</span>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${issue.status === 'open' ? 'bg-teal-50 text-[#00A89B]' : 'bg-gray-100 text-gray-400'}`}>
                {t(issue.status)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── AI Report Section ──────────────────────────────── */}
      <div className="d1-fade-in-up bg-white border-2 border-dashed border-purple-200 rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center">
              <Sparkles size={20} className="text-purple-500" />
            </div>
            <h2 className="font-extrabold text-sm">{t('ai_smart_report')}</h2>
          </div>
          {aiReport && (
            <button onClick={handleCopy} className="text-xs flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-all active:scale-95 px-2 py-1 rounded-lg hover:bg-gray-50">
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              {copied ? t('copied') : t('copy')}
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs text-gray-400 font-medium">{t('generate_report')}</p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleAiReport('')}
              disabled={aiLoading}
              className="text-xs px-3.5 py-2 bg-purple-50 text-purple-600 rounded-xl border border-purple-100 hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all duration-200 disabled:opacity-50 active:scale-95"
            >
              {t('current_factory_status')}
            </button>
            <button
              onClick={() => handleAiReport(t('monthly_performance_prompt'))}
              disabled={aiLoading}
              className="text-xs px-3.5 py-2 bg-purple-50 text-purple-600 rounded-xl border border-purple-100 hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all duration-200 disabled:opacity-50 active:scale-95"
            >
              {t('monthly_performance')}
            </button>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleAiReport(customPrompt) }} className="flex gap-2">
          <input
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            disabled={aiLoading}
            placeholder={t('custom_report_prompt')}
            className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 ring-purple-300/40 focus:border-purple-200 placeholder:text-gray-400 transition-all"
          />
          <button
            type="submit"
            disabled={aiLoading || !customPrompt.trim()}
            className="bg-purple-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-purple-600 transition-all duration-200 disabled:opacity-50 active:scale-95 shadow-sm shadow-purple-500/20"
          >
            {t('generate_ai_report')}
          </button>
        </form>

        {aiLoading && (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="w-8 h-8 border-[3px] border-purple-200 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-400">{t('generating')}</p>
          </div>
        )}

        {aiReport && !aiLoading && (
          <div className="flex flex-col gap-4 d1-fade-in-up">
            <div className="bg-gray-50 rounded-xl p-4 text-xs leading-relaxed whitespace-pre-wrap border border-gray-100 select-text text-gray-600">
              {aiReport}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-500 rounded-xl text-xs hover:text-gray-700 hover:bg-gray-100 transition-all active:scale-95 border border-gray-100"
              >
                <Printer size={15} />
                {t('print')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Excel Export Modal ──────────────────────────────── */}
      {showExcelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm d1-backdrop-in" onClick={() => setShowExcelModal(false)} />
          <div className="relative w-full max-w-sm bg-white border border-gray-100 rounded-2xl shadow-2xl flex flex-col overflow-hidden d1-scale-in" dir={dir}>
            <div className="flex items-center justify-between p-5 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Calendar size={18} className="text-emerald-500" />
                </div>
                <h3 className="font-bold">{t('export_excel')}</h3>
              </div>
              <button onClick={() => setShowExcelModal(false)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-all active:scale-90">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleExport} className="p-5 flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1.5 font-medium">{t('start_date')}</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 ring-[#00A89B]/20 transition cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1.5 font-medium">{t('end_date')}</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 ring-[#00A89B]/20 transition cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={exporting}
                className="w-full flex items-center justify-center gap-2 bg-[#00A89B] text-white py-3 rounded-xl font-semibold hover:bg-[#00A89B]/90 disabled:opacity-50 transition-all active:scale-95 shadow-md shadow-[#00A89B]/20"
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
