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

    // --- 关键修改：允许邮箱或用户名登录 ---
    // 我们现在使用 findFirst 来查找匹配邮箱或用户名的用户
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

    // 确保有一个 JWT_SECRET 环境变量
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    // 生成 JWT (JSON Web Token)
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' } // Token 有效期 7 天
    );

    // 将 Token 安全地存入 httpOnly cookie
    cookies().set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 天
      path: '/',
      sameSite: 'lax',
    });

    // 从返回给前端的用户信息中移除密码
    const { password: _, ...userWithoutPassword } = user;
    
    // --- 关键修改：使用自定义 stringify 函数来处理 BigInt ---
    return new Response(stringify(userWithoutPassword), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[LOGIN_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
