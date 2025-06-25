// types/index.ts
export interface User {
  id: string
  email: string
  username: string
  role: 'user' | 'admin'
  avatarUrl?: string
  storageUsed: number
  uploadCount: number
  isActive: boolean
}

export interface Image {
  id: string
  userId: string
  albumId?: string
  filename: string
  originalName: string
  url: string
  thumbnailUrl?: string
  size: number
  width: number
  height: number
  format: string
  isPublic: boolean
  views: number
  metadata?: Record<string, any>
  createdAt: string
}

export interface Album {
  id: string
  userId: string
  name: string
  description?: string
  coverImageId?: string
  isPublic: boolean
  imageCount: number
  createdAt: string
  updatedAt: string
}

export interface SystemSettings {
  siteName: string
  enableRegistration: boolean
  requireInviteCode: boolean
  enableGuestUpload: boolean
  enablePublicGallery: boolean
  maxUploadSize: number
  allowedFormats: string[]
  imageQuality: number
  enableCompression: boolean
  compressionQuality: number
  enableWatermark: boolean
  watermarkText?: string
  watermarkPosition: string
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  enableThumbnails: boolean
  thumbnailSize: number
  dailyUploadLimit: number
  ipBlacklist: string[]
}