// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 定义一个全局变量来缓存安装状态，避免每次请求都查询数据库
let isInstalled: boolean | null = null;

async function checkInstallation() {
  if (isInstalled === null) {
    try {
      const admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
      });
      isInstalled = Boolean(admin);
      console.log(`Installation check: ${isInstalled ? 'Installed' : 'Not Installed'}`);
    } catch (error) {
      console.error("Database connection error during installation check. Assuming not installed.", error);
      // 如果数据库连接失败 (例如，在 CI/CD 环境中没有 DATABASE_URL)，
      // 我们假设它未安装，但这应该由环境变量处理。
      // 在实际运行中，这通常意味着需要安装。
      isInstalled = false;
    }
  }
  return isInstalled;
}

export async function middleware(request: NextRequest) {
  const isAppInstalled = await checkInstallation();
  const { pathname } = request.nextUrl;

  // 如果未安装，并且用户访问的不是安装页面或其相关API，
  // 则重定向到安装页面。
  if (!isAppInstalled && !pathname.startsWith('/install') && !pathname.startsWith('/api/install')) {
    return NextResponse.redirect(new URL('/install', request.url));
  }

  // 如果已安装，但用户试图访问安装页面，
  // 则将他们重定向到首页。
  if (isAppInstalled && pathname.startsWith('/install')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// 定义中间件应该在哪些路径上运行
export const config = {
  matcher: [
    /*
     * 匹配除了以下划线开头 (如 _next/static, _next/image, api/auth)
     * 或包含点 (如 favicon.ico) 的所有请求路径。
     * 这确保了中间件在所有页面路由上运行。
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
