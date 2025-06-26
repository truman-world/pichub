// pages/api/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password || password.length < 6) {
        return res.status(400).json({ message: '所有字段均为必填项，且密码长度不能少于6位' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: 'USER', // 默认注册为普通用户
            },
        });

        res.status(201).json({ message: '注册成功！', userId: newUser.id });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: '用户名或邮箱已被使用。' });
        }
        console.error('Registration error:', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
}
