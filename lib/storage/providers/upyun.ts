/*
 * ==========================================================
 * 文件: lib/storage/providers/upyun.ts
 * ==========================================================
 * 修复说明: 添加了缺失的 `import { StorageAdapter } from '../index';`
 */
import * as upyun from 'upyun';
import { StorageAdapter } from '../index';

export class UpyunStorage implements StorageAdapter {
    private client: any;
    constructor(config: any) {
        const service = new upyun.Service(config.serviceName, config.operatorName, config.operatorPassword);
        this.client = new upyun.Client(service);
    }
    async upload(fileBuffer: Buffer, filename: string): Promise<string> { throw new Error('Method not implemented.'); }
    async delete(filename: string): Promise<void> { throw new Error('Method not implemented.'); }
}
