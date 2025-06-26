// lib/auth.ts
import { jwtVerify } from 'jose';
import type { NextApiRequest, NextPageContext } from 'next';

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
 * For Pages Router (getServerSideProps, API Routes).
 * Takes the `req` object to access cookies.
 * This is the function used by your /login API and /admin/dashboard page.
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
        console.error('JWT Verification failed in verifyAuth:', err);
        return { user: null };
    }
}
