/*
 * ==========================================================
 * 重构文件: lib/storage/index.ts
 * ==========================================================
 * 修复说明:
 * 1. 彻底删除了错误的 `import { StorageProvider } from '@prisma/client'`。
 * 2. Prisma 现在会自动将 schema.prisma 中定义的 enum 注入到它的客户端类型中，
 * 这意味着当其他文件从 '@prisma/client' 导入时，将能正确找到 StorageProvider 类型。
 * 3. 我们在这里只定义所有存储驱动都必须遵守的“统一接口规范” (StorageAdapter)。
 */

// 定义一个所有存储驱动都必须实现的统一接口
// 这确保了无论是本地存储还是云存储，它们都以同样的方式工作。
export interface StorageAdapter {
  /**
   * 上传文件
   * @param fileBuffer 文件的二进制数据
   * @param filename 在存储服务中使用的唯一文件名
   * @returns 返回文件的可公开访问 URL
   */
  upload(fileBuffer: Buffer, filename: string): Promise<string>;

  /**
   * 删除文件
   * @param filename 在存储服务中使用的唯一文件名
   */
  delete(filename: string): Promise<void>;
}
