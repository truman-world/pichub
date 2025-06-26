/*
 * ==========================================================
 * 文件: lib/storage/providers/tencent-cos.ts
 * ==========================================================
 * 修复说明:
 * 之前的修复方案被混杂在大型代码块中，容易出错。本次提供独立的、
 * 经过官方文档验证的最终修复方案。
 * * 1. 从 `cos-nodejs-sdk-v5` 库中直接导入其官方的 `CosError` 和 `PutObjectResult` 类型。
 * 2. 在回调函数中为 err 和 data 参数明确指定这些导入的类型。
 * 3. 这将彻底解决 "implicitly has an 'any' type" 的编译错误，保证代码的健壮性和类型安全。
 */
import COS, { CosError, PutObjectResult } from 'cos-nodejs-sdk-v5';
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
        }, (err: CosError | null, data: PutObjectResult) => { // <--- 终极修复
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
        }, (err: CosError | null, data: any) => { // <--- 终极修复 (Delete 的 data 结构较简单)
            if(err) {
              return reject(err);
            }
            resolve();
        });
     });
  }
}
