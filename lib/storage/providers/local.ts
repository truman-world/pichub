/*
 * ==========================================================
 * 文件: lib/storage/providers/local.ts
 * ==========================================================
 * 修复说明: 添加了缺失的 `import { StorageAdapter } from '../index';`
 */
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { StorageAdapter } from '../index'; // <--- 关键修复

export class LocalStorage implements StorageAdapter {
  private uploadDir: string;
  private baseUrl: string;
  constructor(config: any) {
    this.uploadDir = config.uploadDir || join(process.cwd(), 'public', 'uploads');
    this.baseUrl = config.baseUrl || '/uploads';
  }
  async upload(fileBuffer: Buffer, filename: string): Promise<string> {
    await mkdir(this.uploadDir, { recursive: true });
    const filePath = join(this.uploadDir, filename);
    await writeFile(filePath, fileBuffer);
    return `${this.baseUrl}/${filename}`;
  }
  async delete(filename: string): Promise<void> {
    const filePath = join(this.uploadDir, filename);
    await unlink(filePath);
  }
}
