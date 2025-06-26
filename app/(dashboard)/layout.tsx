// app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation';
import { getAuth } from '@/lib/auth-app'; // --- 核心修复：从新的认证文件导入 ---
import Link from 'next/link';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuth();

  // 如果用户未登录，则重定向到登录页面
  if (!user) {
    redirect('/login');
  }

  return (
    <div>
      <header style={{ padding: '10px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem' }}>PicHub Dashboard</h1>
        <nav>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span>欢迎, {user.username || user.email}!</span>
              {/* 在这里可以添加头像和退出登录按钮 */}
              <Link href="/api/logout">退出登录</Link>
            </div>
          )}
        </nav>
      </header>
      <main style={{ padding: '20px' }}>
        {children}
      </main>
    </div>
  );
}
