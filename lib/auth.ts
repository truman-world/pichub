/*
 * ==========================================
 * 新文件: lib/auth.ts
 * ==========================================
 * 这是一个服务端的工具函数，用于从请求的 cookie 中解码 JWT，
 * 并安全地获取当前登录用户的信息。
 */
import { cookies } from 'next/headers';
import * as jose from 'jose';
import prisma from './prisma';

interface UserPayload extends jose.JWTPayload {
  id: string;
  role: 'ADMIN' | 'USER';
}

export async function getAuth() {
  const token = cookies().get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jose.jwtVerify<UserPayload>(token, secret);
    
    // 从数据库中获取最新的用户信息，确保用户未被删除
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, username: true, email: true, role: true }
    });
    
    return user;

  } catch (e) {
    console.error("JWT Verification failed:", e);
    return null;
  }
}
