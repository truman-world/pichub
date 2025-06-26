import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import * as jose from 'jose';

// --- 关键改进：极其健壮的错误处理和日志记录 ---
export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ message: '用户名和密码不能为空。' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      // 为了安全，不提示“用户不存在”，而是返回一个通用的失败信息
      return NextResponse.json({ message: '用户名或密码无效。' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ message: '用户名或密码无效。' }, { status: 401 });
    }
    
    if (!process.env.JWT_SECRET) {
      console.error("[API_LOGIN_ERROR] JWT_SECRET is not defined in environment variables!");
      throw new Error("服务器配置错误：JWT_SECRET 未设置。");
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new jose.SignJWT({ id: user.id, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(secret);

    const response = NextResponse.json({ 
      message: '登录成功', 
      user: { id: user.id, username: user.username, role: user.role } 
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;

  } catch (error: any) {
    // --- 这里会捕获任何可能的错误，包括数据库连接错误 ---
    console.error("[API_LOGIN_ERROR] An unexpected error occurred:", error);

    // --- 确保总是返回一个有效的 JSON，防止客户端崩溃 ---
    return NextResponse.json(
      { message: `服务器内部错误，请联系管理员。` },
      { status: 500 }
    );
  }
}
