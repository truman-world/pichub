/*
 * ==========================================================
 * 文件: lib/storage/providers/webdav.ts
 * ==========================================================
 * 修复说明: 修正了 upload 方法的参数顺序。
 */
import { createClient } from 'webdav';
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
