/*
 * ==========================================
 * 更新文件: app/(dashboard)/layout.tsx
 * ==========================================
 * 修复说明:
 * 1. 这里是解决 "初始化页面不出现" 问题的关键。
 * 2. 我们将初始化检查的逻辑放在了这个受保护区域的布局文件中。
 * 3. 它会在用户尝试访问任何 dashboard 页面时，在服务器端进行检查。
 * 4. 如果数据库中没有任何用户，它会强制将用户重定向到 /setup 页面。
 * 5. 这样既保证了公共主页可以被任何人访问，又确保了系统的首次设置流程一定会被执行。
 */
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userCount = await prisma.user.count();
  const user = await getAuth();

  // 如果数据库为空，且当前访问的不是/setup页面，则强制重定向
  if (userCount === 0) {
    // 假设第一个登录（或注册后登录）的人应该去设置页面
    // 此处需要配合中间件逻辑
    redirect('/setup');
  }
  
  // 如果用户未登录，中间件会处理重定向，但此处作为双重保障
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen">
      {/* 在这里可以添加仪表盘的侧边栏导航 */}
      <aside className="w-64 bg-background border-r p-4 hidden md:block">
          <h2 className="text-xl font-semibold mb-4">PicHub</h2>
          <nav className="flex flex-col space-y-2">
            <Link href="/dashboard" className="p-2 rounded-md hover:bg-accent">仪表盘</Link>
            <Link href="/dashboard/gallery" className="p-2 rounded-md hover:bg-accent">我的图库</Link>
            <Link href="/dashboard/albums" className="p-2 rounded-md hover:bg-accent">相册管理</Link>
            <Link href="/dashboard/upload" className="p-2 rounded-md hover:bg-accent">上传图片</Link>
          </nav>
      </aside>
      <main className="flex-1">
        {/* 这里可以放仪表盘的顶部导航栏 */}
        {children}
      </main>
    </div>
  );
}
