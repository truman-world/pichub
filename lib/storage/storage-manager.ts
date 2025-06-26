// lib/storage/storage-manager.ts - 存储管理器 (最终修正版)
import prisma from '@/lib/prisma';
import path from 'path';
import { StorageAdapter } from './index';
import { StorageProvider } from '@prisma/client';
import { LocalStorageAdapter } from './local-storage';

export class StorageManager {
  private static instance: StorageManager;
  private storageServices: Map<string, StorageAdapter> = new Map();

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  /**
   * 获取默认的存储配置。
   * 在 schema.prisma 中，我们用 isDefault 字段来标记。
   */
  async getDefaultStorage(): Promise<StorageAdapter> {
    // --- 核心修复 #1 ---
    // 1. 模型名称已从错误的 `storageConfig` 更正为正确的 `storage`。
    // 2. 查询条件已从错误的 `isActive` 和 `priority` 更正为 schema 中定义的 `isDefault`。
    const defaultStorageConfig = await prisma.storage.findFirst({
      where: { isDefault: true },
    });

    // 如果数据库中没有设置任何默认存储，则回退到代码中定义的本地存储。
    if (!defaultStorageConfig) {
      console.warn("No default storage config found in DB, defaulting to local fallback.");
      return this.getOrCreateStorage('default-local-fallback', StorageProvider.LOCAL, {
        uploadDir: path.resolve('./public/uploads'),
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      });
    }

    // 如果找到了默认存储配置，则使用它。
    return this.getOrCreateStorage(
      defaultStorageConfig.id,
      defaultStorageConfig.provider,
      defaultStorageConfig.config
    );
  }

  /**
   * 根据指定的驱动类型获取存储实例。
   */
  async getStorageByProvider(provider: StorageProvider): Promise<StorageAdapter> {
    // --- 核心修复 #2 ---
    // 模型名称已从错误的 `storageConfig` 更正为正确的 `storage`。
    const storageConfig = await prisma.storage.findFirst({
      where: { provider },
    });

    if (!storageConfig) {
      throw new Error(`Storage configuration for provider "${provider}" not found in database.`);
    }

    return this.getOrCreateStorage(storageConfig.id, storageConfig.provider, storageConfig.config);
  }

  /**
   * (内部方法) 根据配置创建或获取缓存的存储适配器实例。
   */
  private getOrCreateStorage(
    id: string,
    provider: StorageProvider,
    config: any
  ): StorageAdapter {
    if (!this.storageServices.has(id)) {
      let adapter: StorageAdapter;

      switch (provider) {
        case StorageProvider.LOCAL:
          adapter = new LocalStorageAdapter(config);
          break;
        
        // 当您未来支持 S3 时，可以在此添加 case
        // case StorageProvider.S3:
        //   adapter = new S3StorageAdapter(config);
        //   break;

        default:
          throw new Error(`Unsupported storage provider: ${provider}`);
      }
      this.storageServices.set(id, adapter);
    }
    
    return this.storageServices.get(id)!;
  }
}
