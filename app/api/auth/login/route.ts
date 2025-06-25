// app/api/auth/login/route.ts
    import { NextResponse } from 'next/server';
    import { PrismaClient } from '@prisma/client';
    import bcrypt from 'bcryptjs';
    import jwt from 'jsonwebtoken';
    import { cookies } from 'next/headers';

    const prisma = new PrismaClient();
    // 确保您有一个 JWT_SECRET 环境变量
    const JWT_SECRET = process.env.JWT_SECRET || 'your-default-jwt-secret';

    export async function POST(request: Request) {
      try {
        const { email, password } = await request.json();

        if (!email || !password) {
          return new NextResponse('Missing fields', { status: 400 });
        }

        // 查找用户
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return new NextResponse('Invalid credentials', { status: 401 });
        }

        // 验证密码
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
          return new NextResponse('Invalid credentials', { status: 401 });
        }

        // 生成 Token
        const token = jwt.sign(
          { userId: user.id, email: user.email, role: user.role },
          JWT_SECRET,
          { expiresIn: '7d' } // Token 有效期 7 天
        );

        // 将 Token 存入 cookie
        cookies().set('auth-token', token, {
          httpOnly: true, // 防止客户端脚本访问
          secure: process.env.NODE_ENV === 'production', // 仅在 HTTPS 下发送
          maxAge: 60 * 60 * 24 * 7, // 7 天
          path: '/',
        });

        // 从返回的用户信息中移除密码
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(userWithoutPassword);
      } catch (error) {
        console.error('[LOGIN_ERROR]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
      }
    }