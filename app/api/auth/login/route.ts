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
    // 我们现在接受一个通用的 identifier
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return new NextResponse('Missing identifier or password', { status: 400 });
    }

    // 同时通过邮箱或用户名查找用户
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
        ],
      },
    });

    // 如果找不到用户，或者密码不正确，都返回相同的错误信息，防止信息泄露
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return new NextResponse('Invalid credentials', { status: 401 });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    // 生成 JWT (JSON Web Token)
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 将 Token 安全地存入 httpOnly cookie
    cookies().set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax',
    });

    const { password: _, ...userWithoutPassword } = user;
    
    // 使用自定义 stringify 函数来处理 BigInt
    return new Response(stringify(userWithoutPassword), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[LOGIN_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
