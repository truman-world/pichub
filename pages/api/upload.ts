// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import formidable, { File } from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import { verifyAuth } from '@/lib/auth'; // 引入认证函数

// 增加请求体大小限制，并禁用 bodyParser 让 formidable 全权处理。
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false, 
  },
};

// 定义并创建最终可公开访问的媒体目录
const UPLOAD_DIR = path.join(process.cwd(), '.next/static/media');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  
  // 验证用户身份
  const auth = await verifyAuth(req);

  try {
    const form = formidable({
      maxFileSize: 100 * 1024 * 1024, // 设置最大文件大小为 100MB
      uploadDir: UPLOAD_DIR, // 直接上传到最终的可访问目录
      filename: (name, ext, part) => {
        // 生成一个包含时间戳和随机数的唯一文件名
        return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
      },
    });

    const [fields, files] = await form.parse(req);
    const uploadedFile = (files.file as File[])?.[0];

    if (!uploadedFile) {
      return res.status(400).json({ message: '没有找到上传的文件' });
    }
    
    const uniqueFilename = uploadedFile.newFilename;
    const publicUrl = `/uploads/${uniqueFilename}`; // 使用相对路径

    // 将图片信息存入数据库，并关联用户ID
    const imageRecord = await prisma.image.create({
      data: {
        filename: uniqueFilename,
        originalName: uploadedFile.originalFilename || 'untitled',
        url: publicUrl,
        size: uploadedFile.size,
        userId: auth.user?.userId || null, // 如果用户登录则关联，否则为 null
      },
    });

    // 返回绝对URL给前端
    const absoluteUrl = new URL(publicUrl, process.env.NEXTAUTH_URL || 'http://localhost:3000').href;

    res.status(200).json({
      message: '上传成功',
      url: absoluteUrl,
      image: imageRecord, // 返回完整的图片记录
    });

  } catch (error) {
    console.error('Upload API error:', error);
    res.status(500).json({ message: '文件上传失败，请检查服务器日志。' });
  }
}
