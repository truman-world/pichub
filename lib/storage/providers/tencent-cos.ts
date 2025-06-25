// lib/storage/providers/tencent-cos.ts - 腾讯云 COS
import COS from 'cos-nodejs-sdk-v5'
import { StorageAdapter } from '../index'

export class TencentCOSStorage implements StorageAdapter {
  private client: COS
  private bucket: string
  private region: string

  constructor(config: {
    secretId: string
    secretKey: string
    bucket: string
    region: string
  }) {
    this.client = new COS({
      SecretId: config.secretId,
      SecretKey: config.secretKey
    })
    this.bucket = config.bucket
    this.region = config.region
  }

  async upload(key: string, buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.putObject({
        Bucket: this.bucket,
        Region: this.region,
        Key: key,
        Body: buffer
      }, (err, data) => {
        if (err) reject(err)
        else resolve(`https://${data.Location}`)
      })
    })
  }

  async delete(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.deleteObject({
        Bucket: this.bucket,
        Region: this.region,
        Key: key
      }, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }

  async get(key: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this.client.getObject({
        Bucket: this.bucket,
        Region: this.region,
        Key: key
      }, (err, data) => {
        if (err) reject(err)
        else resolve(data.Body as Buffer)
      })
    })
  }

  getUrl(key: string): string {
    return this.client.getObjectUrl({
      Bucket: this.bucket,
      Region: this.region,
      Key: key,
      Sign: true,
      Expires: 3600
    })
  }

  async exists(key: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.client.headObject({
        Bucket: this.bucket,
        Region: this.region,
        Key: key
      }, (err) => {
        resolve(!err)
      })
    })
  }
}