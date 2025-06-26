/*
 * ==========================================================
 * 文件: lib/storage/providers/ftp.ts
 * ==========================================================
 * 修复说明: 修正了 upload 方法的参数顺序。
 */
import FtpClient from 'ftp';
import { StorageAdapter } from '../index';
export class FTPStorage implements StorageAdapter {
    constructor(config: any) { console.warn("FTPStorage is a placeholder."); }
    async upload(fileBuffer: Buffer, filename: string): Promise<string> { throw new Error('Method not implemented.'); }
    async delete(filename: string): Promise<void> { throw new Error('Method not implemented.'); }
}
