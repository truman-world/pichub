// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) - we handle API protection inside the routes themselves.
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export async function middleware(request: NextRequest) {
  // --- 核心修复：使用 request.url 作为基准来构建绝对URL ---
  // 这可以确保 fetch 请求能正确地包含 basePath (例如 /pichub)
  const statusApiUrl = new URL('/api/install/status', request.url);
  
  try {
    const response = await fetch(statusApiUrl);
    
    if (!response.ok) {
      throw new Error(`API status check failed with status: ${response.status}`);
    }
    
    const { installed } = await response.json();
    const { pathname } = request.nextUrl; // pathname 包含 basePath, e.g., /pichub/install

    // 如果未安装，并且当前路径不是安装页，则重定向到安装页
    if (!installed && pathname !== '/pichub/install') {
      return NextResponse.redirect(new URL('/pichub/install', request.url));
    }

    // 如果已安装，但用户试图访问安装页，则重定向到首页
    if (installed && pathname === '/pichub/install') {
      return NextResponse.redirect(new URL('/pichub', request.url));
    }

  } catch (error) {
    console.error('[Middleware] Fetch error:', error);
    // 在 fetch 本身就失败的极端情况下 (例如网络问题)，也重定向到安装页
    const { pathname } = request.nextUrl;
    if (pathname !== '/pichub/install') {
        return NextResponse.redirect(new URL('/pichub/install', request.url));
    }
  }

  return NextResponse.next();
}
