// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client'; // 引入 Role 枚举

// 自定义一个 JSON 序列化函数，用来处理 BigInt
function stringify(obj: any) {
  return JSON.stringify(
    obj,
    (key, value) => (typeof value === 'bigint' ? value.toString() : value)
  );
}

export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json();

    if (!email || !username || !password) {
      return new NextResponse('Missing fields', { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return new NextResponse('User already exists', { status: 409 });
    }

    // --- 关键修改：检查是否是第一个用户 ---
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? Role.ADMIN : Role.USER;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role, // 在创建时设置角色
      },
    });
    
    return new Response(stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[REGISTER_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
