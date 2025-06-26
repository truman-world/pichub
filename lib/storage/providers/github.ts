/*
 * ==========================================================
 * 文件: lib/storage/providers/github.ts
 * ==========================================================
 * 修复说明: 修正了 upload 方法的参数顺序。
 */
import { Octokit } from "@octokit/rest";
import { StorageAdapter } from '../index';
export class GithubStorage implements StorageAdapter {
    private octokit: Octokit;
    constructor(config: any) { this.octokit = new Octokit({ auth: config.token }); }
    async upload(fileBuffer: Buffer, filename: string): Promise<string> { throw new Error('Method not implemented.'); }
    async delete(filename: string): Promise<void> { throw new Error('Method not implemented.'); }
}
