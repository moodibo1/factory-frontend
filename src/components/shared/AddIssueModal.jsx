import { useState } from 'react'
import { X, ImageIcon, Video } from 'lucide-react'
import { issuesService } from '@/services/api'
import { useParams } from 'react-router-dom'
import { clsx } from 'clsx'
import { useAuth } from '@/store/AuthContext'
import { useTranslation } from 'react-i18next'

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime']
const MAX_IMAGE_SIZE = 10 * 1024 * 1024  // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024  // 50MB

export default function AddIssueModal({ onClose, onSuccess }) {
  const { id: routeCategory } = useParams()
  const { user } = useAuth()
  const { t } = useTranslation()
  const isAdmin = user?.role === 'admin'

  // Issue types with translations
  const types = [
    { value: 'problem', label: t('problem'), class: 'border-orange-500 text-orange-500' },
    { value: 'note', label: t('note'), class: 'border-blue-500 text-blue-500' },
    { value: 'emergency', label: t('emergency'), class: 'border-red-500 text-red-500' },
  ]

  // Default category depends on where the user is
  const defaultCategory = routeCategory || (user?.category !== 'admin' ? user?.category : 'lab') || 'lab'

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('problem')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [mediaType, setMediaType] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Admin cross-posting selections
  const [selectedCategories, setSelectedCategories] = useState([defaultCategory])

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) { // keep at least one
        setSelectedCategories(selectedCategories.filter(c => c !== cat))
      }
    } else {
      setSelectedCategories([...selectedCategories, cat])
    }
  }

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return

    // Validate file type
    if (!ALLOWED_TYPES.includes(f.type)) {
      setError(t('file_type_error'))
      e.target.value = ''
      return
    }

    // Validate file size
    const isVideo = f.type.startsWith('video')
    if (isVideo && f.size > MAX_VIDEO_SIZE) {
      setError(t('file_size_video_error'))
      e.target.value = ''
      return
    }
    if (!isVideo && f.size > MAX_IMAGE_SIZE) {
      setError(t('file_size_image_error'))
      e.target.value = ''
      return
    }

    setError('')
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setMediaType(isVideo ? 'video' : 'image')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('type', type)
      // Send the first selected category as the primary category
      formData.append('category', selectedCategories[0])
      // Send the full array of selected categories for cross-posting
      formData.append('categories', JSON.stringify(selectedCategories))
      if (file) formData.append('file', file)
      await issuesService.create(formData)
      onSuccess()
      onClose()
    } catch (err) {
      setError(err.message || t('error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div 
        className="bg-background w-full max-w-md rounded-2xl p-6 flex flex-col gap-4 overflow-y-auto"
        style={{ maxHeight: 'calc(100svh - 2rem)' }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{t('add_new')}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Issue Type Selection */}
          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground font-semibold">{t('report_type')}:</p>
            <div className="flex gap-2">
              {types.map((t) => (
                <button
                  type="button"
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={clsx(
                    'flex-1 py-2 rounded-xl border-2 text-sm font-medium transition',
                    type === t.value ? t.class + ' bg-muted' : 'border-border text-muted-foreground'
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title Input */}
          <input
            type="text"
            placeholder={t('title_placeholder')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary"
          />

          {/* Admin Category Selection */}
          {isAdmin && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground font-semibold">
                {t('publish_in')} {t('admins_only')}:
              </p>
              <div className="flex gap-2">
                {[
                  { id: 'lab', label: t('labs') },
                  { id: 'filling', label: t('filling') },
                  { id: 'production', label: t('production') }
                ].map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCategory(c.id)}
                    className={clsx(
                      "px-3 py-1.5 rounded-full text-xs font-medium border transition",
                      selectedCategories.includes(c.id) ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground border-border hover:bg-muted"
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description Textarea */}
          <textarea
            placeholder={t('description_placeholder')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary resize-none"
          />

          {/* Media Upload */}
          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground font-semibold">{t('media_attachment')}:</p>
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:bg-muted transition">
              {preview ? (
                mediaType === 'video' ? (
                  <video src={preview} className="w-full h-40 object-cover rounded-lg" controls />
                ) : (
                  <img src={preview} className="w-full h-40 object-cover rounded-lg" alt="preview" />
                )
              ) : (
                <>
                  <div className="flex gap-3 text-muted-foreground">
                    <ImageIcon size={24} />
                    <Video size={24} />
                  </div>
                  <span className="text-sm text-muted-foreground">{t('upload_image_video')}</span>
                </>
              )}
              <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/quicktime" className="hidden" onChange={handleFile} />
            </label>
            <p className="text-xs text-muted-foreground -mt-1">
              {t('allowed_types')} | {t('max_limits')}
            </p>
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-destructive text-center">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? t('loading') : t('publish')}
          </button>
        </form>
      </div>
    </div>
  )
}
