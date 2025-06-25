// FILE: lib/storage/providers/github.ts
// 注意：使用 GitHub 作为图床违反其服务条款，仅用于技术演示
import { Octokit } from "@octokit/rest";
import { StorageAdapter } from '../index';

export class GithubStorage implements StorageAdapter {
  private octokit: Octokit;
  private owner: string;
  private repo: string;
  private path: string;
  private cdnUrl: string;

  constructor(config: { authToken: string; owner: string; repo: string; path?: string; }) {
    this.octokit = new Octokit({ auth: config.authToken });
    this.owner = config.owner;
    this.repo = config.repo;
    this.path = config.path || 'uploads';
    this.cdnUrl = `https://cdn.jsdelivr.net/gh/${config.owner}/${config.repo}@main`;
  }

  async upload(key: string, buffer: Buffer): Promise<string> {
    const remotePath = `${this.path}/${key}`;
    await this.octokit.repos.createOrUpdateFileContents({
      owner: this.owner,
      repo: this.repo,
      path: remotePath,
      message: `feat: upload image ${key}`,
      content: buffer.toString('base64'),
    });
    return this.getUrl(key);
  }
  async delete(key: string): Promise<void> {
     console.warn("GithubStorage.delete is not efficiently implemented. It requires getting the file SHA first.");
  }
  async get(key: string): Promise<Buffer> {
    throw new Error('Method not implemented.');
  }
  getUrl(key: string): string {
     return `${this.cdnUrl}/${this.path}/${key}`;
  }
  async exists(key: string): Promise<boolean> {
    try {
      await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: `${this.path}/${key}`,
      });
      return true;
    } catch {
      return false;
    }
  }
}