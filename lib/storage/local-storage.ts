// lib/storage/local-storage.ts
import { StorageAdapter } from './index';
import path from 'path';
import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';

// 定义本地存储的配置接口
interface LocalConfig {
  uploadDir: string;
  baseUrl: string;
}

// 创建一个实现了 StorageAdapter 接口的本地存储类
export class LocalStorageAdapter implements StorageAdapter {
  private uploadDir: string;
  private baseUrl: string;

  constructor(config: any) {
    const localConfig = config as LocalConfig;
    this.uploadDir = localConfig.uploadDir;
    this.baseUrl = localConfig.baseUrl;

    // 确保上传目录存在
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(fileBuffer: Buffer, filename: string): Promise<string> {
    const filePath = path.join(this.uploadDir, filename);
    await fs.writeFile(filePath, fileBuffer);
    // 返回可公开访问的 URL
    return `${this.baseUrl}/uploads/${filename}`;
  }

  async delete(filename: string): Promise<void> {
    const filePath = path.join(this.uploadDir, filename);
    try {
      if(existsSync(filePath)) {
        await fs.unlink(filePath);
      }
    } catch (error) {
      console.error(`Error deleting file ${filename}:`, error);
      // 根据需要决定是否抛出错误
    }
  }
}
