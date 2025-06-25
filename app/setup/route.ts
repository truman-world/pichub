import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

/**
 * 安装API
 * - 检查是否已安装（通过检查用户数量）
 * - 创建管理员账户
 */
export async function POST(req: NextRequest) {
  try {
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      return NextResponse.json(
        { message: '应用已安装，不可重复设置。' },
        { status: 403 }
      );
    }

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: '用户名和密码不能为空。' },
        { status: 400 }
      );
    }
     if (password.length < 6) {
      return NextResponse.json(
        { message: '密码长度不能少于6位。' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });

    return NextResponse.json({ message: '管理员创建成功！' });
  } catch (error) {
    console.error('[SETUP_ERROR]', error);
    return NextResponse.json(
      { message: '服务器内部错误，无法完成安装。' },
      { status: 500 }
    );
  }
}
