// FILE: lib/storage/providers/qiniu.ts
import qiniu from 'qiniu';
import { StorageAdapter } from '../index';

export class QiniuStorage implements StorageAdapter {
  private mac: qiniu.auth.digest.Mac;
  private config: qiniu.conf.Config;
  private bucketManager: qiniu.rs.BucketManager;
  private bucket: string;
  private domain: string;

  constructor(config: {
    accessKey: string;
    secretKey: string;
    bucket: string;
    zone?: string;
    domain: string;
  }) {
    this.mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey);
    this.config = new qiniu.conf.Config();
    
    // --- 这里是修改的地方 ---
    // 使用更安全的方式来设置 Zone
    if (config.zone && config.zone in qiniu.zone) {
      this.config.zone = qiniu.zone[config.zone as keyof typeof qiniu.zone];
    }
    // -------------------------
    
    this.bucketManager = new qiniu.rs.BucketManager(this.mac, this.config);
    this.bucket = config.bucket;
    this.domain = config.domain;
  }

  async upload(key: string, buffer: Buffer): Promise<string> {
    const uploadToken = this.getUploadToken();
    const formUploader = new qiniu.form_up.FormUploader(this.config);
    const putExtra = new qiniu.form_up.PutExtra();
    
    return new Promise((resolve, reject) => {
      formUploader.put(uploadToken, key, buffer, putExtra, (err, body) => {
        if (err) reject(err);
        else resolve(this.getUrl(body.key));
      });
    });
  }

  async delete(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.bucketManager.delete(this.bucket, key, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async get(key: string): Promise<Buffer> {
    const url = this.getUrl(key);
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  getUrl(key: string): string {
    // 确保域名不以 / 结尾
    const domain = this.domain.endsWith('/') ? this.domain.slice(0, -1) : this.domain;
    return `${domain}/${key}`;
  }

  async exists(key: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.bucketManager.stat(this.bucket, key, (err) => {
        resolve(!err);
      });
    });
  }

  private getUploadToken(): string {
    const putPolicy = new qiniu.rs.PutPolicy({ scope: this.bucket });
    return putPolicy.uploadToken(this.mac);
  }
}
