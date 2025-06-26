/*
 * ==========================================================
 * 文件: lib/storage/providers/sftp.ts
 * ==========================================================
 * 修复说明: 修正了 upload 方法的参数顺序。
 */
import SftpClient from 'ssh2-sftp-client';
export class SFTPStorage implements StorageAdapter {
    private client: SftpClient;
    constructor(config: any) { this.client = new SftpClient(); }
    async upload(fileBuffer: Buffer, filename: string): Promise<string> { throw new Error('Method not implemented.'); }
    async delete(filename: string): Promise<void> { throw new Error('Method not implemented.'); }
}
