// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- 核心修复 ---
// 我们移除了全局缓存变量 `isInstalled`。
// 现在，每次请求都会直接查询数据库以获取最新的安装状态，
// 这样可以确保在安装完成后状态能被立即识别。

async function checkInstallation() {
  try {
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });
    // 直接返回查询结果，不再缓存
    return Boolean(admin);
  } catch (error) {
    console.error("Database connection error during installation check. Assuming not installed.", error);
    // 在数据库连接失败等极端情况下，默认为未安装
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const isAppInstalled = await checkInstallation();
  const { pathname } = request.nextUrl;

  // 如果未安装，并且用户访问的不是安装页面或其相关API，
  // 则重定向到安装页面。
  if (!isAppInstalled && !pathname.startsWith('/install') && !pathname.startsWith('/api/install')) {
    console.log(`[Middleware] Not installed. Redirecting from ${pathname} to /install`);
    return NextResponse.redirect(new URL('/install', request.url));
  }

  // 如果已安装，但用户试图访问安装页面，
  // 则将他们重定向到首页。
  if (isAppInstalled && pathname.startsWith('/install')) {
    console.log(`[Middleware] Already installed. Redirecting from ${pathname} to /`);
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// 定义中间件应该在哪些路径上运行
export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
