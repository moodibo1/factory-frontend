import { useState, useEffect, useRef } from 'react'
import { Bell, X, CheckCheck, Sparkles, AlertTriangle, Clock, Bot, MessageCircle, CheckCircle } from 'lucide-react'
import { notificationsService } from '@/services/api'
import { useAuth } from '@/store/AuthContext'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'

const typeConfig = {
  critical_issue: { icon: AlertTriangle, color: 'text-red-500',    bg: 'bg-red-500/10' },
  overdue_issue:  { icon: Clock,         color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ai_alert:       { icon: Bot,           color: 'text-purple-500', bg: 'bg-purple-500/10' },
  issue_closed:   { icon: CheckCircle,   color: 'text-green-500',  bg: 'bg-green-500/10' },
  new_comment:    { icon: MessageCircle, color: 'text-blue-500',   bg: 'bg-blue-500/10' },
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
    
    if (i18n.language === 'en') {
      if (days > 0) return `${days} days ago`
      if (hours > 0) return `${hours} hours ago`
      if (mins > 0) return `${mins} minutes ago`
      return 'Just now'
    } else if (i18n.language === 'tr') {
      if (days > 0) return `${days} gün önce`
      if (hours > 0) return `${hours} saat önce`
      if (mins > 0) return `${mins} dakika önce`
      return 'Şimdi'
    } else {
      if (days > 0) return `منذ ${days} يوم`
      if (hours > 0) return `منذ ${hours} ساعة`
      if (mins > 0) return `منذ ${mins} دقيقة`
      return 'الآن'
    }
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
        className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition shrink-0"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)} />
          <div className="fixed top-16 left-1/2 -translate-x-1/2 w-[90vw] max-w-sm bg-background border rounded-2xl shadow-xl z-[9999] flex flex-col overflow-hidden" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-bold text-sm">{t('notifications')}</h3>
              <div className="flex items-center gap-3">
                {unread > 0 && (
                  <button onClick={handleMarkAllRead} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition">
                    <CheckCheck size={14} />
                    {t('all') || 'قراءة الكل'}
                  </button>
                )}
                {isAdmin && (
                  <button
                    onClick={handleGenerateAlerts}
                    disabled={generating}
                    className="text-xs text-purple-500 hover:text-purple-700 flex items-center gap-1 transition disabled:opacity-50"
                  >
                    <Sparkles size={14} />
                    {generating ? '...' : t('smart_alerts')}
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-col overflow-y-auto max-h-96">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
                  <Bell size={28} strokeWidth={1.2} />
                  <p className="text-sm">{t('no_data')}</p>
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
                        'flex gap-3 px-4 py-3 border-b last:border-0 cursor-pointer hover:bg-muted/50 transition',
                        notif.is_read === 0 && 'bg-primary/5'
                      )}
                    >
                      <div className={clsx('p-2 rounded-xl h-fit shrink-0', config.bg)}>
                        <Icon size={15} className={config.color} />
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <p className="text-xs font-semibold leading-tight">{notif.title}</p>
                          {isAdmin && (
                            <button onClick={(e) => handleDelete(e, notif.id)} className="text-muted-foreground hover:text-destructive transition shrink-0">
                              <X size={12} />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{notif.body}</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">{timeAgo(notif.created_at)}</p>
                      </div>
                      {notif.is_read === 0 && <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1" />}
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
