// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// 自定义一个 JSON 序列化函数，用来处理 BigInt
function stringify(obj: any) {
  return JSON.stringify(
    obj,
    (key, value) => (typeof value === 'bigint' ? value.toString() : value)
  );
}

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return new NextResponse('Missing identifier or password', { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
        ],
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return new NextResponse('Invalid credentials', { status: 401 });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    cookies().set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax',
    });

    const { password: _, ...userWithoutPassword } = user;
    
    return new Response(stringify(userWithoutPassword), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[LOGIN_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
