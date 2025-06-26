// pages/api/install/status.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });
    
    // 返回一个简单的 JSON 对象，告知前端安装状态
    res.status(200).json({ installed: Boolean(admin) });

  } catch (error) {
    console.error("API Status Check Error:", error);
    // 如果查询失败，也返回未安装，并记录错误
    res.status(500).json({ installed: false, message: 'Error checking installation status.' });
  }
}
