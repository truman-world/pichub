/*
 * ==========================================================
 * 文件: lib/storage/providers/tencent-cos.ts
 * ==========================================================
 * 修复说明:
 * 1. 修正了 upload 方法的参数顺序。
 */
import COS from 'cos-nodejs-sdk-v5'
import { StorageAdapter } from '../index'

export class TencentCOSStorage implements StorageAdapter {
  private client: COS

  constructor(config: any) {
    this.client = new COS({
      SecretId: config.secretId,
      SecretKey: config.secretKey,
    })
  }

  async upload(fileBuffer: Buffer, filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
        this.client.putObject({
            Bucket: 'your-bucket-name' /* 存储桶 */,
            Region: 'your-region' /* 存储桶所在地域，必须字段 */,
            Key: filename,
            Body: fileBuffer,
        }, (err, data) => {
            if (err) {
                return reject(err);
            }
            // 返回 https:// 开头的 url
            resolve('https://' + data.Location)
        });
    });
  }

  async delete(filename: string): Promise<void> {
     return new Promise((resolve, reject) => {
        this.client.deleteObject({
            Bucket: 'your-bucket-name',
            Region: 'your-region',
            Key: filename,
        }, (err, data) => {
            if(err) return reject(err);
            resolve();
        });
     });
  }
}
