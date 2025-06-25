// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

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

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    // --- 这里是修改的地方 ---
    // 我们不再直接使用 NextResponse.json()，而是用我们自定义的 stringify 函数
    // 先序列化，再手动创建 Response 对象，确保 BigInt 被正确转换成字符串
    return new Response(stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[REGISTER_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
