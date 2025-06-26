// lib/auth.ts
import { jwtVerify } from 'jose';
import type { NextApiRequest, NextPageContext } from 'next';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string);
const COOKIE_NAME = 'pichub_session';

interface UserPayload {
    userId: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}

/**
 * 一个服务端的工具函数，用于在 Pages Router 环境中 (getServerSideProps, API Routes)
 * 从请求的 cookie 中解码 JWT，并安全地获取当前登录用户的信息。
 * @param req - Next.js 的请求对象
 * @returns 返回一个包含 user payload 的对象，如果验证失败则 user 为 null。
 */
export async function verifyAuth(req: NextApiRequest | { cookies: NextPageContext['req']['cookies'] }) {
    const token = req.cookies?.[COOKIE_NAME];

    if (!token) {
        return { user: null };
    }

    try {
        const verified = await jwtVerify(token, JWT_SECRET);
        return { user: verified.payload as UserPayload };
    } catch (err) {
        console.error('JWT Verification Error:', err);
        return { user: null };
    }
}
