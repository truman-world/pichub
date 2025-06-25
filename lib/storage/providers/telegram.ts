// FILE: lib/storage/providers/telegram.ts
import TelegramBot from 'node-telegram-bot-api';
import { StorageAdapter } from '../index';

export class TelegramStorage implements StorageAdapter {
    private bot: TelegramBot;
    private chatId: string;

    constructor(config: { token: string; chatId: string; }) {
        this.bot = new TelegramBot(config.token);
        this.chatId = config.chatId;
    }

    async upload(key: string, buffer: Buffer): Promise<string> {
       const photo = await this.bot.sendPhoto(this.chatId, buffer, { caption: key });
       const fileId = photo.photo?.[photo.photo.length - 1]?.file_id;
       if (!fileId) {
           throw new Error("Failed to get file_id from Telegram response.");
       }
       const file = await this.bot.getFile(fileId);
       // Telegram bot API 不直接提供永久的公开 URL
       // 返回 file_id 以供后续使用
       return file.file_path || fileId;
    }
    async delete(key: string): Promise<void> {
         console.warn("TelegramStorage.delete is not possible via bot API.");
    }
    async get(key: string): Promise<Buffer> {
        throw new Error('Method not implemented.');
    }
    getUrl(key: string): string {
        // 返回 file_id
        return key;
    }
    async exists(key: string): Promise<boolean> {
        return false; // 无法有效检查
    }
}
