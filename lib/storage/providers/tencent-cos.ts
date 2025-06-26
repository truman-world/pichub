/*
 * ==========================================================
 * 文件: lib/storage/providers/tencent-cos.ts
 * ==========================================================
 * 修复说明: 为回调函数参数添加了显式类型 `any`，以解决 "implicitly has an 'any' type" 编译错误。
 */
import COS from 'cos-nodejs-sdk-v5';
import { StorageAdapter } from '../index';

export class TencentCOSStorage implements StorageAdapter {
  private client: InstanceType<typeof COS>;
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
        }, (err: any, data: any) => { // <--- 关键修复
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
        }, (err: any, data: any) => { // <--- 关键修复
            if(err) return reject(err);
            resolve();
        });
     });
  }
}
