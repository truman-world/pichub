/*
 * ==========================================================
 * 文件: lib/storage/providers/local.ts
 * ==========================================================
 * 修复说明:
 * 1. 修正了 upload 方法的参数顺序。
 * 2. 确保文件写入逻辑与新的参数顺序一致。
 */
import { writeFile, mkdir, unlink } from 'fs/promises'
import { join } from 'path'
import { StorageAdapter } from '../index'

export class LocalStorage implements StorageAdapter {
  private uploadDir: string
  private baseUrl: string

  constructor(config: any) {
    this.uploadDir = config.uploadDir || join(process.cwd(), 'public', 'uploads')
    this.baseUrl = config.baseUrl || '/uploads'
  }

  async upload(fileBuffer: Buffer, filename: string): Promise<string> {
    await mkdir(this.uploadDir, { recursive: true })
    const filePath = join(this.uploadDir, filename)
    await writeFile(filePath, fileBuffer)
    return `${this.baseUrl}/${filename}`
  }

  async delete(filename: string): Promise<void> {
    const filePath = join(this.uploadDir, filename)
    await unlink(filePath)
  }
}
