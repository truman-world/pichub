/*
 * ==========================================================
 * 文件: lib/storage/providers/github.ts
 * ==========================================================
 * 修复说明: 确认 StorageAdapter 接口已正确导入。
 */
import { Octokit } from "@octokit/rest";
import { StorageAdapter } from '../index';
export class GithubStorage implements StorageAdapter {
    private octokit: Octokit;
    constructor(config: any) { this.octokit = new Octokit({ auth: config.token }); }
    async upload(fileBuffer: Buffer, filename: string): Promise<string> { throw new Error('Method not implemented.'); }
    async delete(filename: string): Promise<void> { throw new Error('Method not implemented.'); }
}
