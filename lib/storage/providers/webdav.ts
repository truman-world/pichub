// FILE: lib/storage/providers/webdav.ts
import { createClient } from "webdav";
import { StorageAdapter } from '../index';

export class WebDAVStorage implements StorageAdapter {
  private client: any;
  private remotePath: string;
  private baseUrl: string;

  constructor(config: { webdavUrl: string; username?: string; password?: string; remotePath: string; baseUrl: string; }) {
    this.client = createClient(config.webdavUrl, {
      username: config.username,
      password: config.password,
    });
    this.remotePath = config.remotePath;
    this.baseUrl = config.baseUrl;
  }
  
  async upload(key: string, buffer: Buffer): Promise<string> {
    const remoteFilePath = `${this.remotePath}/${key}`;
    await this.client.putFileContents(remoteFilePath, buffer);
    return this.getUrl(key);
  }
  async delete(key: string): Promise<void> {
     const remoteFilePath = `${this.remotePath}/${key}`;
     await this.client.deleteFile(remoteFilePath);
  }
  async get(key: string): Promise<Buffer> {
    const remoteFilePath = `${this.remotePath}/${key}`;
    const content = await this.client.getFileContents(remoteFilePath);
    return content as Buffer;
  }
  getUrl(key: string): string {
    return `${this.baseUrl}/${key}`;
  }
  async exists(key: string): Promise<boolean> {
     const remoteFilePath = `${this.remotePath}/${key}`;
     return await this.client.exists(remoteFilePath);
  }
}