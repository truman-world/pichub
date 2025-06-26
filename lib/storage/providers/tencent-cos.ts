/*
 * ==========================================================
 * 文件: lib/storage/providers/tencent-cos.ts
 * ==========================================================
 * 修复说明: 确认 StorageAdapter 接口已正确导入。
 */
import COS from 'cos-nodejs-sdk-v5';
import { StorageAdapter } from '../index';

export class TencentCOSStorage implements StorageAdapter {
  private client: COS;
  private config: any;
  constructor(config: any) {
    this.client = new COS({ SecretId: config.secretId, SecretKey: config.secretKey });
    this.config = config;
  }
  async upload(fileBuffer: Buffer, filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
        this.client.putObject({
            Bucket: this.config.bucket, Region: this.config.region,
            Key: filename, Body: fileBuffer,
        }, (err, data) => {
            if (err) return reject(err);
            resolve('https://' + data.Location);
        });
    });
  }
  async delete(filename: string): Promise<void> {
     return new Promise((resolve, reject) => {
        this.client.deleteObject({
            Bucket: this.config.bucket, Region: this.config.region,
            Key: filename,
        }, (err, data) => {
            if(err) return reject(err);
            resolve();
        });
     });
  }
}
