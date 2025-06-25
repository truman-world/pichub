// FILE: lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// 声明一个全局变量来缓存 PrismaClient 实例
declare global {
  var prisma: PrismaClient | undefined;
}

// 创建 PrismaClient 实例，
// 在开发环境中，我们将其缓存到全局变量中，避免因热重载导致创建过多数据库连接。
const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

export default client;
