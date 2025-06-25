// app/api/auth/register/route.ts
    import { NextResponse } from 'next/server';
    import { PrismaClient } from '@prisma/client';
    import bcrypt from 'bcryptjs';

    const prisma = new PrismaClient();

    export async function POST(request: Request) {
      try {
        const { email, username, password } = await request.json();

        // 检查输入
        if (!email || !username || !password) {
          return new NextResponse('Missing fields', { status: 400 });
        }

        // 检查用户是否已存在
        const existingUser = await prisma.user.findFirst({
          where: { OR: [{ email }, { username }] },
        });

        if (existingUser) {
          return new NextResponse('User already exists', { status: 409 });
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 12);

        // 创建用户
        const user = await prisma.user.create({
          data: {
            email,
            username,
            password: hashedPassword,
          },
        });

        return NextResponse.json(user);
      } catch (error) {
        console.error('[REGISTER_ERROR]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
      }
    }