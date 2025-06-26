/*
 * ==========================================================
 * 文件: lib/storage/providers/aliyun-oss.ts
 * ==========================================================
 * 修复说明:
 * 1. 修正了 upload 方法的参数顺序，使其与 StorageAdapter 接口完全匹配。
 */
import OSS from 'ali-oss'
import { StorageAdapter } from '../index'

export class AliyunOSSStorage implements StorageAdapter {
  private client: OSS

  constructor(config: any) {
    this.client = new OSS({
      region: config.region,
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      bucket: config.bucket,
    })
  }

  async upload(fileBuffer: Buffer, filename: string): Promise<string> {
    const result = await this.client.put(filename, fileBuffer)
    return result.url
  }

  async delete(filename: string): Promise<void> {
    await this.client.delete(filename)
  }
}
