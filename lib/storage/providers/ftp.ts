// FILE: lib/storage/providers/ftp.ts
import FtpClient from 'ftp';
import { StorageAdapter } from '../index';
import path from 'path';

export class FTPStorage implements StorageAdapter {
    // FTP的实现较为复杂，这里提供一个基础框架
    // 您可能需要使用更现代的库如 `basic-ftp`
  constructor(config: any) {
    console.warn("FTPStorage is a placeholder and not fully implemented.");
  }
  async upload(key: string, buffer: Buffer): Promise<string> {
    throw new Error('Method not implemented.');
  }
  async delete(key: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async get(key: string): Promise<Buffer> {
    throw new Error('Method not implemented.');
  }
  getUrl(key: string): string {
    throw new Error('Method not implemented.');
  }
  async exists(key: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}