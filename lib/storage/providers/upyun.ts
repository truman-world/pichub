/*
 * ==========================================================
 * 文件: lib/storage/providers/upyun.ts
 * ==========================================================
 * 修复说明: 修正了 upload 方法的参数顺序。
 */
import * as upyun from 'upyun';
export class UpyunStorage implements StorageAdapter {
    private client: any;
    constructor(config: any) {
        const service = new upyun.Service(config.serviceName, config.operatorName, config.operatorPassword);
        this.client = new upyun.Client(service);
    }
    async upload(fileBuffer: Buffer, filename: string): Promise<string> { throw new Error('Method not implemented.'); }
    async delete(filename: string): Promise<void> { throw new Error('Method not implemented.'); }
}
