// lib/storage/providers/s3.ts - AWS S3 / MinIO
import AWS from 'aws-sdk'
import { StorageAdapter } from '../index'

export class S3Storage implements StorageAdapter {
  private s3: AWS.S3
  private bucket: string

  constructor(config: {
    accessKeyId: string
    secretAccessKey: string
    bucket: string
    region?: string
    endpoint?: string
  }) {
    this.s3 = new AWS.S3({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      region: config.region || 'us-east-1',
      endpoint: config.endpoint,
      s3ForcePathStyle: !!config.endpoint // MinIO 需要
    })
    this.bucket = config.bucket
  }

  async upload(key: string, buffer: Buffer): Promise<string> {
    const params = {
      Bucket: this.bucket,
      Key: key,
      Body: buffer
    }
    
    const result = await this.s3.upload(params).promise()
    return result.Location
  }

  async delete(key: string): Promise<void> {
    await this.s3.deleteObject({
      Bucket: this.bucket,
      Key: key
    }).promise()
  }

  async get(key: string): Promise<Buffer> {
    const result = await this.s3.getObject({
      Bucket: this.bucket,
      Key: key
    }).promise()
    
    return result.Body as Buffer
  }

  getUrl(key: string): string {
    return this.s3.getSignedUrl('getObject', {
      Bucket: this.bucket,
      Key: key,
      Expires: 3600
    })
  }

  async exists(key: string): Promise<boolean> {
    try {
      await this.s3.headObject({
        Bucket: this.bucket,
        Key: key
      }).promise()
      return true
    } catch {
      return false
    }
  }
}