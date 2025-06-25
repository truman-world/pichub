// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // 从 cookie 中获取我们自己的认证 token
  const token = request.cookies.get('auth-token');

  const { pathname } = request.nextUrl;

  // 如果用户未登录（没有token）且想访问仪表板，重定向到登录页
  if (!token && pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 如果用户已登录且访问登录/注册页，重定向到仪表板
  if (token && (pathname === '/login' || pathname === '/register')) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 其他情况放行
  return NextResponse.next();
}

// 定义需要被中间件保护的路径
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
