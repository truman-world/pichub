// lib/auth.ts
import { jwtVerify } from 'jose';
import type { NextApiRequest } from 'next';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string);
const COOKIE_NAME = 'pichub_session';

interface UserPayload {
    userId: string;
    email: string;
    role: 'ADMIN' | 'USER';
    iat?: number;
    exp?: number;
}

/**
 * 一个服务端的工具函数，用于在 Pages Router 环境中 (getServerSideProps, API Routes)
 * 从请求的 cookie 中解码 JWT，并安全地获取当前登录用户的信息。
 * @param req - Next.js 的请求对象
 * @returns 返回一个包含 user payload 的对象，如果验证失败则 user 为 null。
 */
export async function verifyAuth(req: { cookies: NextApiRequest['cookies'] }) {
    const token = req.cookies?.[COOKIE_NAME];

    if (!token) {
        return { user: null };
    }

    try {
        // --- 核心修复：使用泛型参数来告知 jwtVerify payload 的类型 ---
        const { payload } = await jwtVerify<UserPayload>(token, JWT_SECRET);
        return { user: payload };
    } catch (err) {
        console.error('JWT Verification failed in verifyAuth:', err);
        return { user: null };
    }
}
