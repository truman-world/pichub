// pages/api/install.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // 1. 检查是否已存在管理员，防止重复安装
  const adminExists = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (adminExists) {
    return res.status(403).json({ message: '错误：管理员已存在，系统已安装。' });
  }

  // 2. 创建管理员账户
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: '所有字段均为必填项' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ message: '密码长度不能少于6位' });
  }

  try {
    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: 'ADMIN', // 设置角色为管理员
      },
    });

    // 可以在这里创建默认的本地存储配置
    await prisma.storage.create({
        data: {
            name: '默认本地存储',
            provider: 'LOCAL',
            config: {
                "uploadDir": "./public/uploads",
                "baseUrl": "http://localhost:3000" // 部署时应从环境变量读取
            },
            isDefault: true,
        }
    });


    res.status(201).json({ message: 'Admin user created successfully', userId: newUser.id });
  } catch (error: any) {
    // 处理唯一约束冲突等错误
    if (error.code === 'P2002') {
        return res.status(409).json({ message: '用户名或邮箱已被使用。' });
    }
    console.error('Installation error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
}
