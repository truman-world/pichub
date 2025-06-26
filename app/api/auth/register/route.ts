/*
 * =================================================
 * 更新文件: app/api/auth/register/route.ts
 * =================================================
 * 修复说明:
 * 1. 增加了对所有必填字段 (username, email, password) 的严格服务器端校验。
 * 2. 无论发生任何错误，都返回一个结构统一、信息明确的 JSON 错误响应，彻底解决 "Unexpected token 'M'" 的问题。
 * 3. 优化了错误提示，使其对用户更友好、更具体。
 */
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ message: '用户名、邮箱和密码均为必填项。' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message: '密码长度不能少于6位。' }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (existingUser) {
      const message = existingUser.username === username ? '抱歉，该用户名已被占用。' : '抱歉，该邮箱已被注册。';
      return NextResponse.json({ message }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? Role.ADMIN : Role.USER;

    await prisma.user.create({
      data: { username, email, password: hashedPassword, role },
    });

    return NextResponse.json({ message: '注册成功！现在将跳转到登录页面。' }, { status: 201 });
  } catch (error) {
    console.error('[API_REGISTER_ERROR]', error);
    return NextResponse.json({ message: '服务器内部发生错误，请稍后重试。' }, { status: 500 });
  }
}
