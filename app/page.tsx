// app/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function HomePage() {
  // 从 cookie 中检查用户是否已登录
  const token = cookies().get('auth-token');

  if (token) {
    // 如果已登录，跳转到仪表板
    redirect('/dashboard');
  } else {
    // 如果未登录，跳转到登录页
    redirect('/login');
  }
}
