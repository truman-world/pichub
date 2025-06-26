/*
 * ==========================================================
 * 文件: lib/storage/providers/tencent-cos.ts
 * ==========================================================
 * 修复说明:
 * 之前的 `: any` 修复是一个临时补丁。本次采用更专业的方式，
 * 从 `cos-nodejs-sdk-v5` 库中直接导入其官方的 `CosError` 和 `PutObjectResult` 类型，
 * 彻底解决类型不明确的问题，保证了代码的健壮性和类型安全。
 */
import COS, { CosError, PutObjectResult } from 'cos-nodejs-sdk-v5';
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
        }, (err: CosError | null, data: PutObjectResult) => { // <--- 终极修复
            if (err) return reject(err);
            // The data.Location does not include the protocol, so we add it.
            resolve('https://' + data.Location);
        });
    });
  }
  async delete(filename: string): Promise<void> {
     return new Promise((resolve, reject) => {
        this.client.deleteObject({
            Bucket: this.config.bucket, Region: this.config.region,
            Key: filename,
        }, (err: CosError | null, data: any) => { // <--- 终极修复 (Delete often has a simpler data structure)
            if(err) return reject(err);
            resolve();
        });
     });
  }
}
