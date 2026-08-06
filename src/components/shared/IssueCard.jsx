import { useState } from 'react'
import { clsx } from 'clsx'
import { ImageOff, MessageCircle, Send, ChevronRight, Trash2, Archive, ZoomIn, X, Printer } from 'lucide-react'
import { issuesService, adminService } from '@/services/api'
import { useAuth } from '@/store/AuthContext'
import { useTranslation } from 'react-i18next'

const BASE_URL = 'http://localhost:8000'

export default function IssueCard({ issue, onUpdate }) {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState(issue.comments || [])
  const [cycling, setCycling] = useState(false)
  const [showImage, setShowImage] = useState(false)

  const typeMap = {
    problem: { label: t('problem'), class: 'bg-orange-500/20 text-orange-500 border-orange-500/30' },
    note: { label: t('note'), class: 'bg-blue-500/20 text-blue-500 border-blue-500/30' },
    emergency: { label: t('emergency'), class: 'bg-red-500/20 text-red-500 border-red-500/30' },
  }

  const statusMap = {
    open:        { label: t('open'),      class: 'bg-blue-500/20 text-blue-500 border-blue-500/30',     next: t('in_progress') },
    in_progress: { label: t('in_progress'), class: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30', next: t('closed') },
    closed:      { label: t('closed'),       class: 'bg-gray-500/20 text-gray-400 border-gray-500/30',     next: t('reopened') },
    reopened:    { label: t('reopened'),   class: 'bg-purple-500/20 text-purple-500 border-purple-500/30', next: t('in_progress') },
  }

  const isAdmin = user?.role === 'admin'
  const userPerms = (() => {
    try { return JSON.parse(user?.permissions || '{}') }
    catch { return { can_delete: false } }
  })()

  const canDelete = isAdmin || (userPerms.can_delete && issue.creator_id === user?.id)

  const typeInfo = typeMap[issue.type] || typeMap.problem
  const status = statusMap[issue.status] || statusMap.open

  const mediaUrl = issue.media_url
    ? issue.media_url.startsWith('http') ? issue.media_url : `${BASE_URL}${issue.media_url}`
    : null

  // Debug: Check issue data
  console.log('Issue data:', issue)
  console.log('media_type:', issue.media_type)
  console.log('media_url:', issue.media_url)
  console.log('mediaUrl:', mediaUrl)

  const handlePrint = () => {
    // Create a clean print view
    const printWindow = window.open('', '_blank')
    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>طباعة - ${issue.title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            background: white;
            color: #000;
            direction: rtl;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            font-size: 28px;
            color: #1e40af;
            margin-bottom: 5px;
          }
          .header p {
            color: #64748b;
            font-size: 14px;
          }
          .issue-container {
            background: #f8fafc;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 20px;
          }
          .issue-title {
            font-size: 24px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #cbd5e1;
          }
          .meta-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
          }
          .meta-item {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .meta-label {
            font-weight: bold;
            color: #475569;
            font-size: 14px;
          }
          .meta-value {
            color: #1e293b;
            font-size: 14px;
          }
          .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }
          .badge-problem { background: #fed7aa; color: #c2410c; }
          .badge-note { background: #bfdbfe; color: #1e40af; }
          .badge-emergency { background: #fecaca; color: #991b1b; }
          .badge-open { background: #bfdbfe; color: #1e40af; }
          .badge-progress { background: #fef3c7; color: #92400e; }
          .badge-closed { background: #e2e8f0; color: #475569; }
          .badge-reopened { background: #e9d5ff; color: #6b21a8; }
          .description-section {
            margin-top: 20px;
            padding: 20px;
            background: white;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          .description-section h3 {
            font-size: 16px;
            color: #475569;
            margin-bottom: 10px;
          }
          .description-section p {
            color: #1e293b;
            line-height: 1.8;
            font-size: 14px;
            white-space: pre-wrap;
          }
          .image-section {
            margin-top: 20px;
            text-align: center;
          }
          .image-section img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            border: 2px solid #e2e8f0;
          }
          .comments-section {
            margin-top: 30px;
            padding: 20px;
            background: white;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          .comments-section h3 {
            font-size: 18px;
            color: #1e293b;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e2e8f0;
          }
          .comment {
            padding: 12px;
            background: #f8fafc;
            border-radius: 6px;
            margin-bottom: 10px;
            border-right: 3px solid #2563eb;
          }
          .comment-author {
            font-weight: bold;
            color: #1e40af;
            font-size: 13px;
            margin-bottom: 5px;
          }
          .comment-text {
            color: #475569;
            font-size: 13px;
            line-height: 1.6;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 12px;
          }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏭 المصنع الوطني</h1>
          <p>نظام إدارة المشاكل والبلاغات</p>
        </div>
        
        <div class="issue-container">
          <div class="issue-title">${issue.title}</div>
          
          <div class="meta-info">
            <div class="meta-item">
              <span class="meta-label">النوع:</span>
              <span class="badge badge-${issue.type}">${typeInfo.label}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">الحالة:</span>
              <span class="badge badge-${issue.status}">${status.label}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">التاريخ:</span>
              <span class="meta-value">${new Date(issue.created_at).toLocaleDateString('ar-SA')}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">الموظف:</span>
              <span class="meta-value">${issue.creator?.name || 'غير معروف'}</span>
            </div>
          </div>
          
          ${issue.description ? `
          <div class="description-section">
            <h3>الوصف:</h3>
            <p>${issue.description}</p>
          </div>
          ` : ''}
          
          ${issue.media_type === 'image' && mediaUrl ? `
          <div class="image-section">
            <img src="${mediaUrl}" alt="صورة المشكلة" />
          </div>
          ` : ''}
        </div>
        
        ${comments.length > 0 ? `
        <div class="comments-section">
          <h3>التعليقات (${comments.length})</h3>
          ${comments.map(c => `
            <div class="comment">
              <div class="comment-author">${c.author?.name || 'مجهول'}</div>
              <div class="comment-text">${c.text}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        <div class="footer">
          <p>تم الطباعة بتاريخ: ${new Date().toLocaleString('ar-SA')}</p>
          <p>المصنع الوطني © ${new Date().getFullYear()}</p>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `
    
    printWindow.document.write(printContent)
    printWindow.document.close()
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
      const newComment = await issuesService.addComment(issue.id, commentText)
      setComments((prev) => [...prev, newComment])
      setCommentText('')
    } catch (err) {
      console.error(err)
    }
  }

  const handleArchive = async () => {
    if (!confirm('هل تريد أرشفة هذا السجل؟')) return
    try {
      await adminService.archiveIssue(issue.id)
      onUpdate()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    if (!confirm(t('confirm_delete') || 'هل أنت متأكد من حذف هذا السجل نهائياً؟')) return
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

  return (
    <div className="border rounded-2xl overflow-hidden bg-background shadow-sm flex flex-col">
      {issue.media_type === 'image' && mediaUrl ? (
        <>
          <div className="relative cursor-pointer group" onClick={handleImageClick}>
            <img src={mediaUrl} alt="صورة المشكلة" className="w-full h-52 object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <ZoomIn size={32} className="text-white" />
            </div>
          </div>
          {showImage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={() => setShowImage(false)}>
              <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setShowImage(false)} className="absolute -top-10 right-0 text-white hover:text-gray-300">
                  <X size={24} />
                </button>
                <img src={mediaUrl} alt="صورة المشكلة" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
              </div>
            </div>
          )}
        </>
      ) : issue.media_type === 'video' && mediaUrl ? (
        <video src={mediaUrl} controls className="w-full h-52 object-cover bg-black" />
      ) : (
        <div className="w-full h-28 bg-muted flex items-center justify-center text-muted-foreground">
          <ImageOff size={28} />
        </div>
      )}

      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className={clsx('text-xs px-2 py-1 rounded-full border font-medium', typeInfo.class)}>
            {typeInfo.label}
          </span>

          <div className="flex items-center gap-2">
            <span className={clsx('text-xs px-2 py-1 rounded-full border font-medium', status.class)}>
              {status.label}
            </span>
            
            {isAdmin && (
              <>
                {/* Print button - visible only to admins */}
                <button
                  onClick={handlePrint}
                  className="text-muted-foreground hover:text-primary transition p-1"
                  title={t('print')}
                >
                  <Printer size={16} />
                </button>
                
                <button
                  onClick={handleCycleStatus}
                  disabled={cycling}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-dashed border-muted-foreground text-muted-foreground hover:border-primary hover:text-primary transition disabled:opacity-40"
                  title={status.next}
                >
                  {status.next}
                  <ChevronRight size={12} />
                </button>
                {issue.status === 'closed' && !issue.is_archived && (
                  <button
                    onClick={handleArchive}
                    className="text-muted-foreground hover:text-primary transition p-1"
                    title={t('archive')}
                  >
                    <Archive size={16} />
                  </button>
                )}
              </>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
                className="text-muted-foreground hover:text-destructive transition p-1"
                title={t('delete')}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        <h2 className="font-bold text-base">{issue.title}</h2>
        {issue.description && <p className="text-sm text-muted-foreground">{issue.description}</p>}

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
          <span>{issue.creator?.name || t('unknown')}</span>
          <span>{new Date(issue.created_at).toLocaleDateString('ar-IQ')}</span>
        </div>

        <button
          onClick={() => setShowComments((v) => !v)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <MessageCircle size={16} />
          {comments.length > 0 ? `${comments.length} ${t('comment')}` : t('add_comment')}
        </button>

        {showComments && (
          <div className="flex flex-col gap-2 pt-2 border-t">
            {comments.map((c) => (
              <div key={c.id} className="bg-muted rounded-xl px-3 py-2 text-sm">
                <span className="font-medium">{c.author?.name}: </span>
                <span className="text-muted-foreground">{c.text}</span>
              </div>
            ))}
            <form onSubmit={handleComment} className="flex gap-2 mt-1">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={`${t('add_comment')}...`}
                className="flex-1 bg-muted rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-primary"
              />
              <button type="submit" className="text-primary hover:opacity-80">
                <Send size={18} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

