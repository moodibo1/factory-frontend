import { useState } from 'react'
import { clsx } from 'clsx'
import { ImageOff, MessageCircle, Send, ChevronRight, Trash2, Archive, ZoomIn, X, Printer, Share2 } from 'lucide-react'
import { issuesService, adminService } from '@/services/api'
import { useAuth } from '@/store/AuthContext'
import { useTranslation } from 'react-i18next'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function IssueCard({ issue, onUpdate, style }) {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState(issue.comments || [])
  const [cycling, setCycling] = useState(false)
  const [showImage, setShowImage] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [sharing, setSharing] = useState(false)

  const [selectedCategories, setSelectedCategories] = useState(issue.categories || [issue.category])

  const typeMap = {
    problem: { label: t('problem') },
    note: { label: t('note') },
    emergency: { label: t('emergency') },
  }

  const statusMap = {
    open:        { label: t('open'), next: t('in_progress') },
    in_progress: { label: t('in_progress'), next: t('closed') },
    closed:      { label: t('closed'), next: t('reopened') },
    reopened:    { label: t('reopened'), next: t('in_progress') },
  }

  const typeInfo = typeMap[issue.type] || typeMap.problem
  const statusInfo = statusMap[issue.status] || statusMap.open

  const isEmergency = issue.type === 'emergency'

  const getTypeStyle = (type) => {
    switch (type) {
      case 'emergency': return 'bg-red-50 text-red-600 border-red-100'
      case 'problem': return 'bg-amber-50 text-amber-600 border-amber-100'
      case 'note': return 'bg-blue-50 text-blue-600 border-blue-100'
      default: return 'bg-gray-50 text-gray-600 border-gray-100'
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'closed': return 'bg-gray-100 text-gray-500'
      case 'in_progress': return 'bg-yellow-50 text-yellow-600'
      case 'reopened': return 'bg-purple-50 text-purple-600'
      default: return 'bg-teal-50 text-[#00A89B]'
    }
  }

  const isAdmin = user?.role === 'admin'
  const userPerms = (() => {
    try { return JSON.parse(user?.permissions || '{}') }
    catch { return { can_delete: false } }
  })()

  const canDelete = isAdmin || (userPerms.can_delete && issue.creator_id === user?.id)

  const mediaUrl = issue.media_url
    ? issue.media_url.startsWith('http') ? issue.media_url : `${BASE_URL}${issue.media_url}`
    : null

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>${t('print')} - ${issue.title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: sans-serif; padding: 40px; }
          .issue-container { background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 30px; }
        </style>
      </head>
      <body>
        <div class="issue-container">
          <h1>${issue.title}</h1>
          <p>${issue.description}</p>
        </div>
      </body>
      </html>
    `
    printWindow.document.write(printContent)
    printWindow.document.close()
    setTimeout(() => printWindow.print(), 500)
  }

  const handleCycleStatus = async () => {
    setCycling(true)
    try {
      await issuesService.cycleStatus(issue.id)
      onUpdate()
    } catch (err) {
      console.error(err)
    } finally {
      setCycling(false)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    try {
      const newComment = await issuesService.addComment(issue.id, commentText);
      console.log("New comment response:", newComment);
      const commentWithUser = { ...newComment, user_name: user?.name, created_at: new Date().toISOString() };
      setComments((prev) => [...prev, commentWithUser]);
      setCommentText('');
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  }

  const handleArchive = async () => {
    try {
      await adminService.archiveIssue(issue.id)
      onUpdate()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    if (!confirm(t('confirm_delete') || '?? ??? ????? ?? ??????')) return
    try {
      await adminService.deleteIssue(issue.id)
      onUpdate()
    } catch (err) {
      console.error(err)
    }
  }

  const handleImageClick = () => {
    if (issue.media_type === 'image' && mediaUrl) {
      setShowImage(true)
    }
  }

  const handleShareSubmit = async () => {
    setSharing(true)
    try {
      await adminService.shareIssue(issue.id, selectedCategories)
      setShowShareModal(false)
      onUpdate()
    } catch (e) {
      alert(t('error'))
    } finally {
      setSharing(false)
    }
  }

  return (
    <>
      <div
        className={clsx(
          'group relative rounded-2xl bg-white border transition-all duration-300',
          'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/[0.04] hover:border-gray-200',
          'active:scale-[0.99]',
          isEmergency ? 'border-red-200/60 d1-pulse-ring' : 'border-gray-100 shadow-sm'
        )}
        style={style}
      >
        {/* Emergency top accent bar */}
        {isEmergency && (
          <div className="h-1 w-full bg-gradient-to-r from-red-500 via-red-400 to-orange-400 rounded-t-2xl" />
        )}

        {/* Media */}
        {issue.media_type === 'image' && mediaUrl && !imageError ? (
          <div className="relative cursor-pointer overflow-hidden" onClick={handleImageClick}>
            <img
              src={mediaUrl}
              alt={issue.title}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <ZoomIn size={28} className="text-white drop-shadow-lg" />
            </div>
          </div>
        ) : null}

        {/* Body */}
        <div className="p-4 sm:p-5 flex flex-col gap-3">
          {/* Badges row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={clsx(
                'text-[11px] px-2.5 py-1 rounded-full font-semibold border transition-all',
                getTypeStyle(issue.type)
              )}>
                {typeInfo.label}
              </span>
              <span className={clsx(
                'text-[11px] px-2.5 py-1 rounded-full font-semibold',
                getStatusStyle(issue.status)
              )}>
                {statusInfo.label}
              </span>
            </div>

            {/* Admin actions */}
            {isAdmin && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button onClick={() => setShowShareModal(true)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#00A89B] hover:bg-[#00A89B]/8 transition-all active:scale-90" title="Share">
                  <Share2 size={14} />
                </button>
                <button onClick={handlePrint} className="p-1.5 rounded-lg text-gray-400 hover:text-[#00A89B] hover:bg-[#00A89B]/8 transition-all active:scale-90" title="Print">
                  <Printer size={14} />
                </button>
                <button
                  onClick={handleCycleStatus}
                  disabled={cycling}
                  className="text-[10px] px-2 py-1 rounded-lg border border-dashed border-gray-300 text-gray-400 hover:text-[#00A89B] hover:border-[#00A89B]/40 transition-all active:scale-90 disabled:opacity-50"
                >
                  {statusInfo.next} <ChevronRight size={10} className="inline rtl:rotate-180" />
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-[15px] text-gray-900 leading-snug">{issue.title}</h3>

          {/* Description */}
          {issue.description && (
            <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap line-clamp-3">
              {issue.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="flex items-center gap-3">
              {/* Creator */}
              <span className="text-xs text-gray-400 font-medium">
                {issue.creator?.name || t('unknown')}
              </span>
              {/* Date */}
              <span className="text-xs text-gray-300">
                {new Date(issue.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Comments toggle */}
              <button
                onClick={() => setShowComments(!showComments)}
                className={clsx(
                  'flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all active:scale-90',
                  showComments ? 'bg-[#00A89B]/8 text-[#00A89B]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                )}
              >
                <MessageCircle size={13} />
                {comments.length > 0 && <span>{comments.length}</span>}
              </button>

              {/* Delete */}
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all active:scale-90"
                >
                  <Trash2 size={13} />
                </button>
              )}

              {/* Archive (admin only) */}
              {isAdmin && (
                <button
                  onClick={handleArchive}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-all active:scale-90"
                >
                  <Archive size={13} />
                </button>
              )}
            </div>
          </div>

          {/* -- Comments Section ---------------------------- */}
          {showComments && (
            <div className="flex flex-col gap-3 pt-3 border-t border-gray-50 d1-fade-in-up">
              {comments.length > 0 && (
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
{comments.map((c, i) => (
                    <div key={c.id || i} className="bg-gray-50/80 rounded-xl px-3 py-2 text-xs leading-relaxed">
                      <span className="font-semibold text-gray-700">{c.author?.name || t('unknown')}</span>
                      <span className="mx-1.5 text-gray-300">·</span>
                      <span className="text-gray-400">{c.created_at ? new Date(c.created_at).toLocaleDateString() : ''}</span>
                      <p className="text-gray-600 mt-1">{c.text || c.content || c.comment || ''}</p>
                    </div>
                  ))}
                </div>
              )}
              <form onSubmit={handleComment} className="flex gap-2">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={t('add_comment')}
                  className="flex-1 bg-gray-50 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-[#00A89B]/30 transition-shadow"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="p-2 rounded-xl bg-[#00A89B] text-white hover:bg-[#00A89B]/90 transition-all active:scale-90 disabled:opacity-40"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* -- Image Lightbox ------------------------------------ */}
      {showImage && mediaUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 d1-backdrop-in"
          onClick={() => setShowImage(false)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <img
            src={mediaUrl}
            alt={issue.title}
            className="relative z-10 max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl d1-scale-in"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setShowImage(false)}
            className="absolute top-6 right-6 z-20 p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all active:scale-90"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* -- Share Modal --------------------------------------- */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm d1-backdrop-in" onClick={() => setShowShareModal(false)} />
          <div className="relative w-full max-w-xs bg-white rounded-2xl shadow-2xl p-5 flex flex-col gap-4 d1-scale-in">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">{t('cross_post')}</h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-600 transition active:scale-90">
                <X size={18} />
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['lab', 'filling', 'production'].map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategories(prev =>
                      prev.includes(cat) && prev.length > 1
                        ? prev.filter(c => c !== cat)
                        : prev.includes(cat) ? prev : [...prev, cat]
                    )
                  }}
                  className={clsx(
                    'px-3 py-1.5 rounded-xl text-xs font-medium border transition-all active:scale-95',
                    selectedCategories.includes(cat)
                      ? 'bg-[#00A89B] text-white border-[#00A89B]'
                      : 'text-gray-500 border-gray-200 hover:border-[#00A89B]/40'
                  )}
                >
                  {t(cat === 'lab' ? 'labs' : cat)}
                </button>
              ))}
            </div>
            <button
              onClick={handleShareSubmit}
              disabled={sharing}
              className="w-full py-2.5 rounded-xl bg-[#00A89B] text-white text-sm font-semibold hover:bg-[#00A89B]/90 transition-all active:scale-95 disabled:opacity-50"
            >
              {sharing ? t('loading') : t('save')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}





