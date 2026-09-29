import imageCompression from 'browser-image-compression'

/**
 * Compression options for issue images.
 * Target: WebP output, max 1280px dimension, ~250-300KB file size.
 */
const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.3,               // ~300KB target
  maxWidthOrHeight: 1280,        // Max dimension 1280px
  useWebWorker: true,            // Offload to Web Worker (non-blocking UI)
  fileType: 'image/webp',        // Convert to WebP for best compression
  initialQuality: 0.8,           // Starting quality for WebP
  alwaysKeepResolution: false,   // Allow downscaling
}

/**
 * Compresses an image file before upload.
 *
 * - Skips compression for non-image files (videos pass through unchanged).
 * - Skips compression if the image is already small enough (< 300KB).
 * - Converts to WebP format, max 1280px, targeting ~250-300KB.
 * - Returns a new File object with a .webp extension.
 *
 * @param {File} file - The original File object from the file input.
 * @param {function} [onProgress] - Optional callback receiving progress (0-100).
 * @returns {Promise<{file: File, wasCompressed: boolean, originalSize: number, compressedSize: number}>}
 */
export async function compressImage(file, onProgress) {
  // Skip non-image files (videos, etc.)
  if (!file.type.startsWith('image/')) {
    return {
      file,
      wasCompressed: false,
      originalSize: file.size,
      compressedSize: file.size,
    }
  }

  const originalSize = file.size

  // Skip if already small enough (under 300KB)
  if (originalSize <= 300 * 1024) {
    return {
      file,
      wasCompressed: false,
      originalSize,
      compressedSize: originalSize,
    }
  }

  try {
    const options = {
      ...COMPRESSION_OPTIONS,
      onProgress: onProgress || undefined,
    }

    const compressedBlob = await imageCompression(file, options)

    // Build new filename with .webp extension
    const originalName = file.name.replace(/\.[^.]+$/, '')
    const newFileName = `${originalName}.webp`

    // Create a proper File object from the compressed blob
    const compressedFile = new File([compressedBlob], newFileName, {
      type: 'image/webp',
      lastModified: Date.now(),
    })

    return {
      file: compressedFile,
      wasCompressed: true,
      originalSize,
      compressedSize: compressedFile.size,
    }
  } catch (error) {
    // If compression fails, fall back to original file (don't block the user)
    console.warn('Image compression failed, using original file:', error)
    return {
      file,
      wasCompressed: false,
      originalSize,
      compressedSize: originalSize,
    }
  }
}

/**
 * Formats byte size into a human-readable string.
 *
 * @param {number} bytes - File size in bytes.
 * @returns {string} Formatted size string (e.g., "245 KB", "1.2 MB").
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
