// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 定义中间件应该在哪些路径上运行
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * * This is crucial to prevent the middleware from running on API routes
     * that it might call, which would cause an infinite loop.
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export async function middleware(request: NextRequest) {
  // 获取完整的请求URL，用于 fetch
  const absoluteUrl = request.nextUrl.clone();
  absoluteUrl.pathname = '/api/install/status';
  
  try {
    // --- 核心修复 ---
    // 不再直接访问数据库，而是调用我们新建的 API 接口。
    // fetch 会在服务器端发出一个请求到自己的API。
    const response = await fetch(absoluteUrl);
    
    if (!response.ok) {
        // 如果API请求本身失败，我们假设未安装，并记录错误
        console.error(`API status check failed with status: ${response.status}`);
        // 强制重定向到安装页
        if (request.nextUrl.pathname !== '/install') {
            return NextResponse.redirect(new URL('/install', request.url));
        }
        return NextResponse.next();
    }
    
    const { installed } = await response.json();
    const { pathname } = request.nextUrl;

    // 根据从API获取的状态进行判断
    if (!installed && pathname !== '/install') {
      console.log(`[Middleware] API reported Not Installed. Redirecting from ${pathname} to /install`);
      return NextResponse.redirect(new URL('/install', request.url));
    }

    if (installed && pathname === '/install') {
      console.log(`[Middleware] API reported Installed. Redirecting from ${pathname} to /`);
      return NextResponse.redirect(new URL('/', request.url));
    }

  } catch (error) {
    console.error('[Middleware] Fetch error:', error);
    // 在 fetch 本身就失败的极端情况下 (例如网络问题)，也重定向到安装页
    if (request.nextUrl.pathname !== '/install') {
      return NextResponse.redirect(new URL('/install', request.url));
    }
  }

  return NextResponse.next();
}
