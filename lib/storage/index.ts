// lib/storage/index.ts - 存储服务主入口
import { StorageProvider } from '@prisma/client'
import { LocalStorage } from './providers/local'
import { AliyunOSSStorage } from './providers/aliyun-oss'
import { TencentCOSStorage } from './providers/tencent-cos'
import { S3Storage } from './providers/s3'
import { QiniuStorage } from './providers/qiniu'
import { UpyunStorage } from './providers/upyun'
import { SFTPStorage } from './providers/sftp'
import { FTPStorage } from './providers/ftp'
import { WebDAVStorage } from './providers/webdav'
import { GithubStorage } from './providers/github'
import { TelegramStorage } from './providers/telegram'

export interface StorageAdapter {
  upload(key: string, buffer: Buffer, metadata?: any): Promise<string>
  delete(key: string): Promise<void>
  get(key: string): Promise<Buffer>
  getUrl(key: string): string
  exists(key: string): Promise<boolean>
}

export class StorageService {
  private adapter: StorageAdapter

  constructor(provider: StorageProvider, config: any) {
    switch (provider) {
      case StorageProvider.LOCAL:
        this.adapter = new LocalStorage(config)
        break
      case StorageProvider.ALIYUN_OSS:
        this.adapter = new AliyunOSSStorage(config)
        break
      case StorageProvider.TENCENT_COS:
        this.adapter = new TencentCOSStorage(config)
        break
      case StorageProvider.AWS_S3:
      case StorageProvider.MINIO:
        this.adapter = new S3Storage(config)
        break
      case StorageProvider.QINIU:
        this.adapter = new QiniuStorage(config)
        break
      case StorageProvider.UPYUN:
        this.adapter = new UpyunStorage(config)
        break
      case StorageProvider.SFTP:
        this.adapter = new SFTPStorage(config)
        break
      case StorageProvider.FTP:
        this.adapter = new FTPStorage(config)
        break
      case StorageProvider.WEBDAV:
        this.adapter = new WebDAVStorage(config)
        break
      case StorageProvider.GITHUB:
        this.adapter = new GithubStorage(config)
        break
      case StorageProvider.TELEGRAM:
        this.adapter = new TelegramStorage(config)
        break
      default:
        throw new Error(`Unsupported storage provider: ${provider}`)
    }
  }

  async upload(key: string, buffer: Buffer, metadata?: any): Promise<string> {
    return this.adapter.upload(key, buffer, metadata)
  }

  async delete(key: string): Promise<void> {
    return this.adapter.delete(key)
  }

  async get(key: string): Promise<Buffer> {
    return this.adapter.get(key)
  }

  getUrl(key: string): string {
    return this.adapter.getUrl(key)
  }

  async exists(key: string): Promise<boolean> {
    return this.adapter.exists(key)
  }
}