// FILE: lib/storage/providers/sftp.ts
import SftpClient from 'ssh2-sftp-client';
import { StorageAdapter } from '../index';
import path from 'path';

export class SFTPStorage implements StorageAdapter {
  private client: SftpClient;
  private config: SftpClient.ConnectOptions;
  private remotePath: string;
  private baseUrl: string;

  constructor(config: SftpClient.ConnectOptions & { remotePath: string; baseUrl: string; }) {
    this.client = new SftpClient();
    this.config = config;
    this.remotePath = config.remotePath;
    this.baseUrl = config.baseUrl;
  }

  // 这个私有方法用于连接，现在不再需要检查，因为每次操作都会重新建立连接
  private async connect() {
    await this.client.connect(this.config);
  }

  async upload(key: string, buffer: Buffer): Promise<string> {
    await this.connect();
    const remoteDir = path.dirname(path.join(this.remotePath, key));
    await this.client.mkdir(remoteDir, true);
    await this.client.put(buffer, path.join(this.remotePath, key));
    await this.client.end();
    return this.getUrl(key);
  }

  async delete(key: string): Promise<void> {
    await this.connect();
    await this.client.delete(path.join(this.remotePath, key));
    await this.client.end();
  }

  async get(key: string): Promise<Buffer> {
     await this.connect();
     const data = await this.client.get(path.join(this.remotePath, key));
     await this.client.end();
     return data as Buffer;
  }

  getUrl(key: string): string {
     return `${this.baseUrl}/${key}`;
  }
  
  async exists(key: string): Promise<boolean> {
    await this.connect();
    const result = await this.client.exists(path.join(this.remotePath, key));
    await this.client.end();
    return result !== false;
  }
}
