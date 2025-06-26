// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // --- 核心修复：导入 Prisma Client ---
import { StorageManager } from '@/lib/storage/storage-manager';
import formidable, { File } from 'formidable';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';
import path from 'path';

// 禁用 Next.js 默认的 body parser，因为 formidable 会处理它
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);
    
    const uploadedFile = (files.file as File[])?.[0];

    if (!uploadedFile) {
      return res.status(400).json({ message: '没有找到上传的文件' });
    }

    // 1. 获取激活的存储服务
    const storageManager = StorageManager.getInstance();
    const storage = await storageManager.getDefaultStorage();

    // 2. 读取文件内容
    const fileBuffer = await fs.readFile(uploadedFile.filepath);

    // 3. 创建一个唯一的文件名以避免冲突
    const originalName = uploadedFile.originalFilename || 'untitled';
    const extension = path.extname(originalName);
    const uniqueFilename = `${randomUUID()}${extension}`;

    // 4. 使用存储服务上传文件
    const publicUrl = await storage.upload(fileBuffer, uniqueFilename);
    
    // 5. 将图片信息存入数据库
    // 注意：这里我们假设游客也可以上传，所以 userId 是可选的。
    // 在您的真实业务中，您需要从 session 中获取 userId。
    const imageRecord = await prisma.image.create({
        data: {
            filename: uniqueFilename,
            originalName: originalName,
            url: publicUrl,
            size: uploadedFile.size,
            // userId: session.user.id // 在集成认证后取消此行注释
        }
    });
    
    // 6. 返回成功的响应和图片的永久 URL
    res.status(200).json({ 
        message: '上传成功', 
        url: publicUrl,
        imageId: imageRecord.id
    });

  } catch (error) {
    console.error('Upload API error:', error);
    res.status(500).json({ message: '文件上传失败' });
  }
}
