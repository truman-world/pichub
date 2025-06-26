/*
 * ==========================================================
 * 文件: lib/storage/providers/webdav.ts
 * ==========================================================
 * 修复说明: 添加了缺失的 `import { StorageAdapter } from '../index';`
 */
import { createClient } from 'webdav';
import { StorageAdapter } from '../index';

export class WebDAVStorage implements StorageAdapter {
    private client: any;
    constructor(config: any) {
        this.client = createClient(config.url, {
            username: config.username,
            password: config.password,
        });
    }
    async upload(fileBuffer: Buffer, filename: string): Promise<string> { throw new Error('Method not implemented.'); }
    async delete(filename: string): Promise<void> { throw new Error('Method not implemented.'); }
}
