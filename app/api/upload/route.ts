/*
 * ==========================================================
 * 新文件: app/api/upload/route.ts
 * ==========================================================
 * 这是项目的核心上传接口，它负责：
 * 1. 接收从前端发送过来的图片文件。
 * 2. 将文件存储到服务器的 `public/uploads` 目录下。
 * 3. 在数据库的 `Image` 表中创建一条记录。
 * 4. 将一个可公开访问的、真实的图片 URL 返回给前端。
 */
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { randomBytes } from 'crypto';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth'; // 我们将创建一个新的 auth 工具
import { mkdir } from 'fs/promises';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: '没有检测到文件。' }, { status: 400 });
    }

    const user = await getAuth(); // 获取当前登录的用户信息

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 生成一个随机的文件名，避免重名
    const fileExtension = file.name.split('.').pop();
    const randomName = randomBytes(16).toString('hex') + '.' + fileExtension;
    
    // 定义存储路径 (服务器的 public 目录)
    const relativeUploadDir = 'uploads';
    const uploadDir = join(process.cwd(), 'public', relativeUploadDir);
    
    // 确保目录存在
    await mkdir(uploadDir, { recursive: true });

    const filePath = join(uploadDir, randomName);
    
    await writeFile(filePath, buffer);

    // 生成可公开访问的 URL
    const fileUrl = `/${relativeUploadgDir}/${randomName}`;

    // 在数据库中创建记录
    // 关键修复：根据 TypeScript 错误提示，将 'name' 字段修改为 'title'
    const image = await prisma.image.create({
      data: {
        title: file.name, // 使用 'title' 字段
        url: fileUrl,
        size: file.size,
        userId: user?.id, // 如果是游客上传，userId 为 null
      },
    });

    return NextResponse.json({
      success: true,
      url: fileUrl,
      name: file.name,
      message: '图片上传成功！',
    });

  } catch (error) {
    console.error('[API_UPLOAD_ERROR]', error);
    return NextResponse.json({ message: '图片上传失败，服务器发生错误。' }, { status: 500 });
  }
}
