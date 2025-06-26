// lib/storage/storage-manager.ts - 存储管理器
import prisma from '@/lib/prisma' // 移除了大括号
import { StorageAdapter } from './index';
import { StorageProvider } from '@prisma/client'

export class StorageManager {
  private static instance: StorageManager
  private storageServices: Map<string, StorageService> = new Map()

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager()
    }
    return StorageManager.instance
  }

  async getActiveStorage(): Promise<StorageService> {
    // 获取激活的存储配置
    const activeConfig = await prisma.storageConfig.findFirst({
      where: { isActive: true },
      orderBy: { priority: 'desc' }
    })

    if (!activeConfig) {
      // 如果没有配置，使用本地存储
      return this.getOrCreateStorage('local', StorageProvider.LOCAL, {
        uploadDir: './uploads',
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      })
    }

    return this.getOrCreateStorage(
      activeConfig.id,
      activeConfig.provider,
      activeConfig.config
    )
  }

  async getStorageByProvider(provider: StorageProvider): Promise<StorageService> {
    const config = await prisma.storageConfig.findFirst({
      where: { provider }
    })

    if (!config) {
      throw new Error(`Storage configuration for ${provider} not found`)
    }

    return this.getOrCreateStorage(config.id, config.provider, config.config)
  }

  private getOrCreateStorage(
    id: string,
    provider: StorageProvider,
    config: any
  ): StorageService {
    if (!this.storageServices.has(id)) {
      this.storageServices.set(id, new StorageService(provider, config))
    }
    
    return this.storageServices.get(id)!
  }
}
