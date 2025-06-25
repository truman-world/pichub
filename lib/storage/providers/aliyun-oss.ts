// lib/storage/providers/aliyun-oss.ts - 阿里云 OSS
import OSS from 'ali-oss'
import { StorageAdapter } from '../index'

export class AliyunOSSStorage implements StorageAdapter {
  private client: OSS

  constructor(config: {
    accessKeyId: string
    accessKeySecret: string
    bucket: string
    region: string
    endpoint?: string
  }) {
    this.client = new OSS({
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      bucket: config.bucket,
      region: config.region,
      endpoint: config.endpoint
    })
  }

  async upload(key: string, buffer: Buffer): Promise<string> {
    const result = await this.client.put(key, buffer)
    return result.url
  }

  async delete(key: string): Promise<void> {
    await this.client.delete(key)
  }

  async get(key: string): Promise<Buffer> {
    const result = await this.client.get(key)
    return result.content
  }

  getUrl(key: string): string {
    return this.client.signatureUrl(key, { expires: 3600 })
  }

  async exists(key: string): Promise<boolean> {
    try {
      await this.client.head(key)
      return true
    } catch {
      return false
    }
  }
}
