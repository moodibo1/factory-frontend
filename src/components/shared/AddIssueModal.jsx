import { useState } from 'react'
import { ImageIcon, Video, Loader2, X } from 'lucide-react'
import { issuesService } from '@/services/api'
import { useParams } from 'react-router-dom'
import clsx from 'clsx'
import { useAuth } from '@/store/AuthContext'
import { useTranslation } from 'react-i18next'
import { compressImage, formatFileSize } from '@/lib/imageCompression'

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
    { value: 'problem', label: t('problem'), activeClass: 'border-amber-400 bg-amber-50 text-amber-600' },
    { value: 'note', label: t('note'), activeClass: 'border-blue-400 bg-blue-50 text-blue-600' },
    { value: 'emergency', label: t('emergency'), activeClass: 'border-red-400 bg-red-50 text-red-600' },
  ]

  // Default category depends on where user is
  const defaultCategory = routeCategory || (user?.categories?.length ? user.categories[0] : 'lab') || 'lab'

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('problem')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [mediaType, setMediaType] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Compression states
  const [compressing, setCompressing] = useState(false)
  const [compressionProgress, setCompressionProgress] = useState(0)
  const [compressionInfo, setCompressionInfo] = useState(null)

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

  const handleFile = async (e) => {
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
    setCompressionInfo(null)

    // Compress images before setting state
    if (!isVideo) {
      setCompressing(true)
      setCompressionProgress(0)

      try {
        const result = await compressImage(f, (progress) => {
          setCompressionProgress(Math.round(progress))
        })

        setFile(result.file)
        setPreview(URL.createObjectURL(result.file))
        setMediaType('image')

        // Show compression savings info
        if (result.wasCompressed) {
          const savedPercent = Math.round((1 - result.compressedSize / result.originalSize) * 100)
          setCompressionInfo({
            originalSize: result.originalSize,
            compressedSize: result.compressedSize,
            savedPercent,
          })
        }
      } catch {
        // Fallback: use original file if compression completely fails
        setFile(f)
        setPreview(URL.createObjectURL(f))
        setMediaType('image')
      } finally {
        setCompressing(false)
        setCompressionProgress(0)
      }
    } else {
      // Videos pass through unchanged
      setFile(f)
      setPreview(URL.createObjectURL(f))
      setMediaType('video')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description || '')
      formData.append('type', type)

      // Ensure valid non-empty arrays
      const catsToSubmit = selectedCategories.length > 0 ? selectedCategories : [defaultCategory]
      formData.append('category', catsToSubmit[0]) // Primary category legacy field
      formData.append('categories', JSON.stringify(catsToSubmit))

      console.log('Publishing payload:', { title, type, catsToSubmit })

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm d1-backdrop-in" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative bg-white w-full max-w-md rounded-2xl p-6 flex flex-col gap-4 overflow-y-auto shadow-2xl d1-scale-in border border-gray-100"
        style={{ maxHeight: 'calc(100svh - 2rem)' }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight">{t('add_new')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-all active:scale-90 p-1 rounded-lg hover:bg-gray-50">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Issue Type Selection */}
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-400 font-semibold">{t('report_type')}:</p>
            <div className="flex gap-2">
              {types.map((tp) => (
                <button
                  type="button"
                  key={tp.value}
                  onClick={() => setType(tp.value)}
                  className={clsx(
                    'flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all duration-200 active:scale-95',
                    type === tp.value ? tp.activeClass : 'border-gray-100 text-gray-400 hover:border-gray-200'
                  )}
                >
                  {tp.label}
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
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-[#00A89B]/20 focus:border-[#00A89B]/30 transition-all"
          />

          {/* Admin Category Selection */}
          {isAdmin && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-gray-400 font-semibold">
                {t('publish_in')} ({t('admins_only')})
              </p>
              <div className="flex gap-2">
                {[
                  { id: 'lab', label: t('labs') },
                  { id: 'secondary_packaging', label: t('secondary_packaging') },
                  { id: 'production', label: t('production') },
                ].map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCategory(c.id)}
                    className={clsx(
                      "px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 active:scale-95",
                      selectedCategories.includes(c.id)
                        ? "bg-[#00A89B] text-white border-[#00A89B] shadow-sm shadow-[#00A89B]/20"
                        : "text-gray-400 border-gray-200 hover:border-[#00A89B]/40"
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
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-[#00A89B]/20 focus:border-[#00A89B]/30 transition-all resize-none"
          />

          {/* Media Upload */}
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-400 font-semibold">{t('media_attachment')}:</p>
            <label className={clsx(
              "flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-200",
              compressing
                ? "border-[#00A89B]/40 bg-[#00A89B]/5"
                : "border-gray-200 hover:bg-gray-50/50 hover:border-[#00A89B]/30"
            )}>
              {compressing ? (
                /* Compression in progress indicator */
                <div className="flex flex-col items-center gap-3 w-full">
                  <Loader2 size={28} className="text-[#00A89B] animate-spin" />
                  <span className="text-sm font-medium text-[#00A89B]">{t('compressing_image')}</span>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-[#00A89B] rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${compressionProgress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{compressionProgress}%</span>
                </div>
              ) : preview ? (
                /* File preview */
                <>
                  {mediaType === 'video' ? (
                    <video src={preview} className="w-full h-40 object-cover rounded-lg" controls />
                  ) : (
                    <img src={preview} className="w-full h-40 object-cover rounded-lg" alt="preview" />
                  )}
                  {/* Compression savings badge */}
                  {compressionInfo && (
                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-medium">
                      <span>&#x2714;</span>
                      <span>
                        {t('compressed')}: {formatFileSize(compressionInfo.originalSize)} &rarr; {formatFileSize(compressionInfo.compressedSize)}
                        {' '}({t('saved')} {compressionInfo.savedPercent}%)
                      </span>
                    </div>
                  )}
                </>
              ) : (
                /* Default upload prompt */
                <>
                  <div className="flex gap-3 text-gray-300">
                    <ImageIcon size={24} />
                    <Video size={24} />
                  </div>
                  <span className="text-sm text-gray-400">{t('upload_image_video')}</span>
                </>
              )}

              <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/quicktime" className="hidden" onChange={handleFile} />
            </label>
            <p className="text-xs text-gray-300 -mt-1">
              {t('allowed_types')} | {t('max_limits')}
            </p>
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-red-500 text-center bg-red-50 py-2 rounded-xl">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || compressing}
            className="w-full bg-[#00A89B] text-white py-3 rounded-xl font-semibold hover:bg-[#00A89B]/90 transition-all duration-200 disabled:opacity-50 active:scale-[0.98] shadow-md shadow-[#00A89B]/20"
          >
            {loading ? t('loading') : t('publish')}
          </button>
        </form>
      </div>
    </div>
  )
}
