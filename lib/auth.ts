// lib/auth.ts
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import type { NextApiRequest, NextPageContext } from 'next';
import prisma from './prisma';

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
 * For App Router (Server Components).
 * Uses `next/headers` to get cookies.
 * This is the function your dashboard layout needs.
 */
export async function getAuth() {
  const token = cookies().get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify<UserPayload>(token, JWT_SECRET);
    
    // Optional: Fetch the latest user data from the DB to ensure they still exist/are valid
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, username: true, email: true, role: true }
    });
    
    return user;

  } catch (e) {
    console.error("JWT Verification failed in getAuth:", e);
    return null;
  }
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
