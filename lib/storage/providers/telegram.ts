/*
 * ==========================================================
 * 文件: lib/storage/providers/telegram.ts
 * ==========================================================
 * 修复说明: 添加了缺失的 `import { StorageAdapter } from '../index';`
 */
import TelegramBot from 'node-telegram-bot-api';
import { StorageAdapter } from '../index'; // <--- 关键修复

export class TelegramStorage implements StorageAdapter {
    private bot: TelegramBot;
    constructor(config: any) { this.bot = new TelegramBot(config.token); }
    async upload(fileBuffer: Buffer, filename: string): Promise<string> { throw new Error('Method not implemented.'); }
    async delete(filename: string): Promise<void> { throw new Error('Method not implemented.'); }
}
