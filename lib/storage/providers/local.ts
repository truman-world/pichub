// lib/storage/providers/local.ts - 本地存储
import fs from 'fs/promises'
import path from 'path'
import { StorageAdapter } from '../index'

export class LocalStorage implements StorageAdapter {
  private uploadDir: string
  private baseUrl: string

  constructor(config: { uploadDir: string; baseUrl: string }) {
    this.uploadDir = config.uploadDir || './uploads'
    this.baseUrl = config.baseUrl || 'http://localhost:3000'
  }

  async upload(key: string, buffer: Buffer): Promise<string> {
    const filePath = path.join(this.uploadDir, key)
    const dir = path.dirname(filePath)
    
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(filePath, buffer)
    
    return this.getUrl(key)
  }

  async delete(key: string): Promise<void> {
    const filePath = path.join(this.uploadDir, key)
    await fs.unlink(filePath)
  }

  async get(key: string): Promise<Buffer> {
    const filePath = path.join(this.uploadDir, key)
    return fs.readFile(filePath)
  }

  getUrl(key: string): string {
    return `${this.baseUrl}/uploads/${key}`
  }

  async exists(key: string): Promise<boolean> {
    const filePath = path.join(this.uploadDir, key)
    try {
      await fs.access(filePath)
      return true
    } catch {
      return false
    }
  }
}