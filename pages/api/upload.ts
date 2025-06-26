// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import formidable, { File } from 'formidable';
import fs from 'fs/promises';
import path from 'path';

// --- 核心修复1：解决大文件上传卡顿/失败问题 ---
// 增加请求体大小限制，并禁用 bodyParser 让 formidable 全权处理。
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false, // 禁用响应大小限制
  },
};

// 确保可公开访问的媒体目录存在
const UPLOAD_DIR = path.join(process.cwd(), '.next/static/media');
fs.mkdir(UPLOAD_DIR, { recursive: true });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const form = formidable({
      maxFileSize: 200 * 1024 * 1024, // 设置最大文件大小为 200MB
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
    
    // --- 核心修复2：生成正确的、可被路由重写规则访问的 URL ---
    // 文件已经被 formidable 移动到了 UPLOAD_DIR 并重命名
    const uniqueFilename = uploadedFile.newFilename;
    const publicUrl = `/uploads/${uniqueFilename}`; // 使用相对路径，与 next.config.mjs 对应

    // 将图片信息存入数据库
    const imageRecord = await prisma.image.create({
      data: {
        filename: uniqueFilename,
        originalName: uploadedFile.originalFilename || 'untitled',
        url: publicUrl, // 存储相对URL
        size: uploadedFile.size,
        // userId: session?.user?.id, // 在认证流程完成后添加
      },
    });

    // 返回绝对URL给前端
    const absoluteUrl = new URL(publicUrl, process.env.NEXTAUTH_URL || 'http://localhost:3000').href;

    res.status(200).json({
      message: '上传成功',
      url: absoluteUrl,
      imageId: imageRecord.id,
    });

  } catch (error) {
    console.error('Upload API error:', error);
    res.status(500).json({ message: '文件上传失败，请检查服务器日志。' });
  }
}
