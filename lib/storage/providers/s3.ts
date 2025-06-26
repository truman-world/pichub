/*
 * ==========================================================
 * 文件: lib/storage/providers/s3.ts
 * ==========================================================
 * 修复说明: 修正了 upload 方法的参数顺序。
 */
import AWS from 'aws-sdk';
export class S3Storage implements StorageAdapter {
  private s3: AWS.S3;
  private bucket: string;
  constructor(config: any) {
    this.s3 = new AWS.S3({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      endpoint: config.endpoint,
      s3ForcePathStyle: true,
    });
    this.bucket = config.bucket;
  }
  async upload(fileBuffer: Buffer, filename: string): Promise<string> {
    const params = { Bucket: this.bucket, Key: filename, Body: fileBuffer };
    const result = await this.s3.upload(params).promise();
    return result.Location;
  }
  async delete(filename: string): Promise<void> {
    const params = { Bucket: this.bucket, Key: filename };
    await this.s3.deleteObject(params).promise();
  }
}
