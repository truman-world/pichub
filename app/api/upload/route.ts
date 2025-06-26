/*
 * ==========================================================
 * 文件: app/api/upload/route.ts
 * ==========================================================
 * 这是项目的核心上传接口，它负责：
 * 1. 接收从前端发送过来的图片文件。
 * 2. 将文件存储到服务器的 `public/uploads` 目录下。
 * 3. 在数据库的 `Image` 表中创建一条记录，并能正确处理游客上传的情况。
 * 4. 将一个可公开访问的、真实的图片 URL 返回给前端。
 */
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomBytes } from 'crypto';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';
import { Prisma } from '@prisma/client'; // 导入 Prisma 类型

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: '没有检测到文件。' }, { status: 400 });
    }

    const user = await getAuth(); // 安全地获取当前登录用户，游客则为 null

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 根据您的设计，生成随机文件名
    const fileExtension = file.name.split('.').pop() || 'tmp';
    const randomName = randomBytes(16).toString('hex') + '.' + fileExtension;
    
    // 默认存储到服务器的 public/uploads 目录
    const relativeUploadDir = 'uploads';
    const uploadDir = join(process.cwd(), 'public', relativeUploadDir);
    
    // 确保目录存在
    await mkdir(uploadDir, { recursive: true });

    const filePath = join(uploadDir, randomName);
    
    await writeFile(filePath, buffer);

    // 生成可公开访问的 URL
    const fileUrl = `/${relativeUploadDir}/${randomName}`;

    // --- 终极修复：采用更健壮、类型安全的方式来构建数据 ---
    // 1. 定义一个严格符合数据库模型的基础数据对象
    const imageData: Prisma.ImageCreateInput = {
      url: fileUrl,
      size: file.size,
      filename: randomName,       // 存储在服务器上的随机文件名
      originalName: file.name,    // 图片的原始文件名
    };

    // 2. 如果用户已登录，则添加用户关联信息
    if (user) {
      imageData.user = {
        connect: {
          id: user.id,
        },
      };
    }

    // 3. 使用这个完美构造好的数据对象来创建记录
    await prisma.image.create({
      data: imageData,
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
