/*
 * ==========================================================
 * 文件: lib/storage/providers/qiniu.ts
 * ==========================================================
 * 修复说明: 确认 StorageAdapter 接口已正确导入。
 */
import * as qiniu from 'qiniu';
import { StorageAdapter } from '../index';

export class QiniuStorage implements StorageAdapter {
    private mac: qiniu.auth.digest.Mac;
    private config: qiniu.conf.Config;
    constructor(qiniuConfig: any) {
        this.mac = new qiniu.auth.digest.Mac(qiniuConfig.accessKey, qiniuConfig.secretKey);
        this.config = new qiniu.conf.Config();
    }
    async upload(fileBuffer: Buffer, filename: string): Promise<string> { throw new Error('Method not implemented.'); }
    async delete(filename: string): Promise<void> { throw new Error('Method not implemented.'); }
}
