/*
 * ==========================================================
 * 文件: lib/storage/providers/telegram.ts
 * ==========================================================
 * 修复说明: 修正了 upload 方法的参数顺序。
 */
import TelegramBot from 'node-telegram-bot-api';
export class TelegramStorage implements StorageAdapter {
    private bot: TelegramBot;
    constructor(config: any) { this.bot = new TelegramBot(config.token); }
    async upload(fileBuffer: Buffer, filename: string): Promise<string> { throw new Error('Method not implemented.'); }
    async delete(filename: string): Promise<void> { throw new Error('Method not implemented.'); }
}
