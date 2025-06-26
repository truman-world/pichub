// pages/api/install.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // 1. 再次检查是否已存在管理员
  const adminExists = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (adminExists) {
    return res.status(403).json({ message: '错误：管理员已存在，系统已安装。' });
  }

  // 2. 验证输入
  const { username, email, password } = req.body;

  if (!username || !email || !password || password.length < 6) {
    return res.status(400).json({ message: '所有字段均为必填项，且密码长度不能少于6位' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // --- 核心修复：使用数据库事务 ---
    // 下面的所有操作，将作为一个整体执行。
    // 如果任何一步失败，所有已完成的操作都将被撤销（回滚）。
    await prisma.$transaction(async (tx) => {
      // 操作1: 创建管理员用户
      await tx.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role: 'ADMIN',
        },
      });

      // 操作2: 创建默认的本地存储配置
      // 注意：确保 baseUrl 指向您服务器的正确地址
      await tx.storage.create({
        data: {
          name: '默认本地存储',
          provider: 'LOCAL',
          config: {
            "uploadDir": "./public/uploads",
            "baseUrl": process.env.NEXTAUTH_URL || "http://8.148.7.13:3000"
          },
          isDefault: true,
        },
      });
    });

    // 如果事务成功，则返回成功响应
    res.status(201).json({ message: '恭喜！系统安装成功！' });

  } catch (error: any) {
    // 如果事务中任何地方出错，都会进入这里
    console.error('--- Installation Transaction Error ---:', error); // 在服务器日志中打印详细错误
    if (error.code === 'P2002') {
      return res.status(409).json({ message: '用户名或邮箱已被使用。' });
    }
    // 向前端返回一个通用的错误信息
    res.status(500).json({ message: '服务器内部错误，请检查服务器日志获取详情。' });
  }
}
