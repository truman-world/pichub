/*
 * ==========================================================
 * 文件: lib/storage/providers/aliyun-oss.ts
 * ==========================================================
 * 修复说明: 确认 StorageAdapter 接口已正确导入。
 */
import OSS from 'ali-oss';
import { StorageAdapter } from '../index';

export class AliyunOSSStorage implements StorageAdapter {
  private client: OSS;
  constructor(config: any) { this.client = new OSS(config); }
  async upload(fileBuffer: Buffer, filename: string): Promise<string> {
    const result = await this.client.put(filename, fileBuffer);
    return result.url;
  }
  async delete(filename: string): Promise<void> { await this.client.delete(filename); }
}
