import { useState, useEffect, useRef } from 'react'
import { Bell, X, CheckCheck, Sparkles, AlertTriangle, Clock, Bot, MessageCircle, CheckCircle } from 'lucide-react'
import { notificationsService } from '@/services/api'
import { useAuth } from '@/store/AuthContext'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'

const typeConfig = {
  critical_issue: { icon: AlertTriangle, color: 'text-red-500',    bg: 'bg-red-50' },
  overdue_issue:  { icon: Clock,         color: 'text-amber-500',  bg: 'bg-amber-50' },
  ai_alert:       { icon: Bot,           color: 'text-purple-500', bg: 'bg-purple-50' },
  issue_closed:   { icon: CheckCircle,   color: 'text-emerald-500', bg: 'bg-emerald-50' },
  new_comment:    { icon: MessageCircle, color: 'text-blue-500',   bg: 'bg-blue-50' },
}

export default function NotificationBell() {
  const { user } = useAuth()
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unread, setUnread] = useState(0)
  const [generating, setGenerating] = useState(false)
  const isAdmin = user?.role === 'admin'

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return t('days_ago', { count: days })
    if (hours > 0) return t('hours_ago', { count: hours })
    if (mins > 0) return t('minutes_ago', { count: mins })
    return t('just_now')
  }

  const fetchAll = async () => {
    try {
      const [all, count] = await Promise.all([
        notificationsService.getAll(),
        notificationsService.getUnreadCount(),
      ])
      setNotifications(all)
      setUnread(count.count)
    } catch {}
  }

  const autoGenerateAlerts = async () => {
    if (!isAdmin) return
    const lastRun = localStorage.getItem('lastAlertGeneration')
    const oneHour = 60 * 60 * 1000
    if (lastRun && Date.now() - parseInt(lastRun) < oneHour) return
    try {
      await notificationsService.generateSmartAlerts()
      localStorage.setItem('lastAlertGeneration', Date.now().toString())
      await fetchAll()
    } catch {}
  }

  useEffect(() => {
    fetchAll()
    autoGenerateAlerts()
    const interval = setInterval(() => {
      fetchAll()
      autoGenerateAlerts()
    }, 20000)
    return () => clearInterval(interval)
  }, [])

  const handleMarkRead = async (id) => {
    await notificationsService.markRead(id)
    fetchAll()
  }

  const handleMarkAllRead = async () => {
    await notificationsService.markAllRead()
    fetchAll()
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    await notificationsService.delete(id)
    fetchAll()
  }

  const handleGenerateAlerts = async () => {
    setGenerating(true)
    try {
      await notificationsService.generateSmartAlerts()
      await fetchAll()
    } catch {}
    finally { setGenerating(false) }
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-xl text-gray-500 hover:text-[#00A89B] hover:bg-[#00A89B]/8 transition-all duration-200 active:scale-90"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-sm shadow-red-500/30">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)} />
          <div className="fixed top-16 left-1/2 w-[90vw] max-w-sm d1-glass border border-white/40 rounded-2xl shadow-xl shadow-black/[0.08] z-[9999] flex flex-col overflow-hidden d1-slide-down" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100/80">
              <h3 className="font-bold text-sm">{t('notifications')}</h3>
              <div className="flex items-center gap-2">
                {unread > 0 && (
                  <button onClick={handleMarkAllRead} className="text-xs text-gray-400 hover:text-[#00A89B] flex items-center gap-1 transition-all active:scale-95 px-1.5 py-0.5 rounded-lg hover:bg-[#00A89B]/8">
                    <CheckCheck size={14} />
                    {t('mark_all_read')}
                  </button>
                )}
                {isAdmin && (
                  <button
                    onClick={handleGenerateAlerts}
                    disabled={generating}
                    className="text-xs text-purple-500 hover:text-purple-700 flex items-center gap-1 transition-all disabled:opacity-50 active:scale-95 px-1.5 py-0.5 rounded-lg hover:bg-purple-50"
                  >
                    <Sparkles size={14} />
                    {generating ? '...' : t('smart_alerts')}
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 transition active:scale-90">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-col overflow-y-auto max-h-96">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-gray-300">
                  <Bell size={28} strokeWidth={1.2} />
                  <p className="text-sm text-gray-400">{t('no_notifications')}</p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const config = typeConfig[notif.type] || typeConfig.ai_alert
                  const Icon = config.icon
                  return (
                    <div
                      key={notif.id}
                      onClick={() => notif.is_read === 0 && handleMarkRead(notif.id)}
                      className={clsx(
                        'flex gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50/50 transition-all duration-150',
                        notif.is_read === 0 && 'bg-[#00A89B]/[0.03]'
                      )}
                    >
                      <div className={clsx('p-2 rounded-xl h-fit shrink-0', config.bg)}>
                        <Icon size={15} className={config.color} />
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <p className="text-xs font-semibold leading-tight text-gray-700">{notif.title}</p>
                          {isAdmin && (
                            <button onClick={(e) => handleDelete(e, notif.id)} className="text-gray-300 hover:text-red-500 transition shrink-0 active:scale-90">
                              <X size={12} />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">{notif.body}</p>
                        <p className="text-[11px] text-gray-300 mt-0.5">{timeAgo(notif.created_at)}</p>
                      </div>
                      {notif.is_read === 0 && <div className="w-2 h-2 bg-[#00A89B] rounded-full shrink-0 mt-1.5" />}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
