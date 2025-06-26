// lib/auth-app.ts
// 这个文件专门为 Next.js App Router (例如 /app 目录下的布局和页面) 提供服务。
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import prisma from './prisma';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string);
const COOKIE_NAME = 'pichub_session';

interface UserPayload {
    userId: string;
    email: string;
    role: 'ADMIN' | 'USER';
}

export async function getAuth() {
  const token = cookies().get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify<UserPayload>(token, JWT_SECRET);
    
    // 从数据库中获取最新的用户信息，确保用户未被删除或权限被更改
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, username: true, email: true, role: true }
    });
    
    return user;

  } catch (e) {
    console.error("JWT Verification failed in getAuth (App Router):", e);
    return null;
  }
}
