/*
 * ==========================================================
 * 文件: lib/storage/providers/qiniu.ts
 * ==========================================================
 * 修复说明: 修正了 upload 方法的参数顺序。
 */
import * as qiniu from 'qiniu';
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
