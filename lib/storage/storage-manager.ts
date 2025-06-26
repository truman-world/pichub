// lib/storage/storage-manager.ts - 存储管理器 (已修复)
import prisma from '@/lib/prisma';
import { StorageAdapter } from './index';
import { StorageProvider } from '@prisma/client';
import { LocalStorageAdapter } from './local-storage'; // 引入具体的适配器

// 如果您有其他存储方式，也在这里引入
// import { S3StorageAdapter } from './s3-storage';

export class StorageManager {
  private static instance: StorageManager;
  // 类型已正确修改为 StorageAdapter
  private storageServices: Map<string, StorageAdapter> = new Map();

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  // 返回类型已修复
  async getActiveStorage(): Promise<StorageAdapter> {
    const activeConfig = await prisma.storageConfig.findFirst({
      where: { isActive: true },
      orderBy: { priority: 'desc' },
    });

    if (!activeConfig) {
      // 如果没有配置，使用默认的本地存储
      console.warn("No active storage config found, defaulting to local storage.");
      return this.getOrCreateStorage('default-local', StorageProvider.LOCAL, {
        uploadDir: path.resolve('./public/uploads'), // 建议使用 public 目录
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      });
    }

    return this.getOrCreateStorage(
      activeConfig.id,
      activeConfig.provider,
      activeConfig.config
    );
  }

  // 返回类型已修复
  async getStorageByProvider(provider: StorageProvider): Promise<StorageAdapter> {
    const config = await prisma.storageConfig.findFirst({
      where: { provider },
    });

    if (!config) {
      throw new Error(`Storage configuration for ${provider} not found`);
    }

    return this.getOrCreateStorage(config.id, config.provider, config.config);
  }

  // 这是被改造为工厂的核心方法
  private getOrCreateStorage(
    id: string,
    provider: StorageProvider,
    config: any
  ): StorageAdapter { // 返回类型已修复
    if (!this.storageServices.has(id)) {
      let adapter: StorageAdapter;

      // 使用 switch 语句来根据 provider 创建不同的适配器实例
      switch (provider) {
        case StorageProvider.LOCAL:
          adapter = new LocalStorageAdapter(config);
          break;
        
        // case StorageProvider.S3:
        //   adapter = new S3StorageAdapter(config); // 示例：如果您有 S3
        //   break;

        // ...可以添加其他存储提供商，如 OSS, COS 等

        default:
          throw new Error(`Unsupported storage provider: ${provider}`);
      }
      this.storageServices.set(id, adapter);
    }
    
    // 使用 '!' 断言值一定存在，因为如果不存在，上面已经 set 了
    return this.storageServices.get(id)!;
  }
}
