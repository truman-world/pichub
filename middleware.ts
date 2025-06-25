import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

/**
 * 路由中间件
 * - 验证JWT token
 * - 保护需要登录才能访问的路由
 * - 将已登录的用户从登录/注册页重定向走
 * - 允许公共路由访问
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;

  // 定义受保护的路由前缀
  const protectedPrefixes = ['/dashboard'];
  const isProtectedRoute = protectedPrefixes.some(prefix => pathname.startsWith(prefix));
  
  // 定义认证页面（登录、注册）和安装页面
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.includes(pathname);
  const isSetupRoute = pathname === '/setup';

  // 如果访问的是安装页面，直接放行
  if (isSetupRoute) {
    return NextResponse.next();
  }

  // 检查Token是否存在
  if (!token) {
    // 如果没有token且访问的是受保护的页面，重定向到登录页
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    // 其他情况（访问公共页面）直接放行
    return NextResponse.next();
  }

  // 如果有token，验证它
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jose.jwtVerify(token, secret);

    // Token有效，用户已登录
    // 如果此时访问登录或注册页，重定向到仪表盘
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    
    // 访问根目录时，也重定向到仪表盘
    if (pathname === '/') {
       return NextResponse.redirect(new URL('/dashboard', req.url));
    }

  } catch (error) {
    // Token无效或过期
    const response = NextResponse.next();
    // 清除无效的cookie
    response.cookies.delete('token');
    
    // 如果访问的是受保护页面，需要重定向到登录页并清除cookie
    if (isProtectedRoute) {
      const redirectResponse = NextResponse.redirect(new URL('/login', req.url));
      redirectResponse.cookies.delete('token');
      return redirectResponse;
    }
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
