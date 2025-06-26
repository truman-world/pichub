/*
 * ==========================================================
 * 文件: lib/storage/providers/tencent-cos.ts
 * ==========================================================
 * 修复说明:
 * 之前的修复方案均告失败，本次采用经过验证的最终方案。
 * 1. 之前导入的 `CosError` 和 `PutObjectResult` 类型无法被正确识别，现已移除。
 * 2. 对回调函数中的 err 和 data 参数明确使用 `: any` 类型。
 * 在处理类型定义不完善的第三方库时，这是最直接、最可靠的解决方案，
 * 它可以确保通过编译，让我们能继续推进项目。
 * 这将彻底解决 "Cannot use namespace 'CosError' as a type" 及相关的所有编译错误。
 */
import COS from 'cos-nodejs-sdk-v5';
import { StorageAdapter } from '../index';

export class TencentCOSStorage implements StorageAdapter {
  private client: InstanceType<typeof COS>;
  private config: any;

  constructor(config: any) {
    this.client = new COS({ 
      SecretId: config.secretId, 
      SecretKey: config.secretKey 
    });
    this.config = config;
  }

  async upload(fileBuffer: Buffer, filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
        this.client.putObject({
            Bucket: this.config.bucket, 
            Region: this.config.region,
            Key: filename, 
            Body: fileBuffer,
        }, (err: any, data: any) => { // <--- 终极修复
            if (err) {
              return reject(err);
            }
            // 官方返回的 data.Location 不包含协议头，我们手动补上
            resolve('https://' + data.Location);
        });
    });
  }

  async delete(filename: string): Promise<void> {
     return new Promise((resolve, reject) => {
        this.client.deleteObject({
            Bucket: this.config.bucket, 
            Region: this.config.region,
            Key: filename,
        }, (err: any, data: any) => { // <--- 终极修复
            if(err) {
              return reject(err);
            }
            resolve();
        });
     });
  }
}
