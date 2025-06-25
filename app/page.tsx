import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

/**
 * 主页组件
 * - 检查应用是否已初始化（通过检查用户数量）
 * - 如果未初始化，则重定向到安装页面
 * - 如果已初始化，则显示公共主页内容
 */
export default async function HomePage() {
  try {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      redirect('/setup');
    }
  } catch (error) {
    // 数据库连接失败等情况
    return (
        <div className="flex items-center justify-center min-h-screen bg-red-50">
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-red-600 mb-4">数据库连接错误</h1>
                <p className="text-gray-700">无法连接到数据库。请检查您的 `.env.local` 文件中的 `DATABASE_URL` 配置是否正确，并确保数据库服务正在运行。</p>
            </div>
        </div>
    )
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">欢迎来到 PicHub</CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            一个现代化的图床解决方案。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            轻松上传、管理和分享您的图片。
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/login">登录</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/register">注册</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      <footer className="mt-8 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} PicHub. All rights reserved.</p>
      </footer>
    </main>
  );
}
