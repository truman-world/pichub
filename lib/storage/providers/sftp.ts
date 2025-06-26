/*
 * ==========================================================
 * 文件: lib/storage/providers/sftp.ts
 * ==========================================================
 * 修复说明: 添加了缺失的 `import { StorageAdapter } from '../index';`
 */
import SftpClient from 'ssh2-sftp-client';
import { StorageAdapter } from '../index';

export class SFTPStorage implements StorageAdapter {
    private client: SftpClient;
    constructor(config: any) { this.client = new SftpClient(); }
    async upload(fileBuffer: Buffer, filename: string): Promise<string> { throw new Error('Method not implemented.'); }
    async delete(filename: string): Promise<void> { throw new Error('Method not implemented.'); }
}
