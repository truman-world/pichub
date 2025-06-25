// lib/image-utils.ts
import imageCompression from 'browser-image-compression'

export interface ImageProcessOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  enableCompression?: boolean
  format?: string
}

export async function processImage(
  file: File,
  options: ImageProcessOptions
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.85,
    enableCompression = true,
    format
  } = options

  if (!enableCompression) return file

  const compressionOptions = {
    maxSizeMB: 10,
    maxWidthOrHeight: Math.max(maxWidth, maxHeight),
    useWebWorker: true,
    initialQuality: quality
  }

  try {
    const compressedFile = await imageCompression(file, compressionOptions)
    
    if (format && format !== file.type.split('/')[1]) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      return new Promise((resolve) => {
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx?.drawImage(img, 0, 0)
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name.replace(/\.[^/.]+$/, `.${format}`), {
                type: `image/${format}`
              }))
            }
          }, `image/${format}`, quality)
        }
        img.src = URL.createObjectURL(compressedFile)
      })
    }
    
    return compressedFile
  } catch (error) {
    console.error('Image compression failed:', error)
    return file
  }
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
      URL.revokeObjectURL(img.src)
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}