// app/page.tsx
"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UploadZone } from '@/components/upload/upload-zone';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // 当用户信息加载完毕后，如果用户已登录，则自动跳转到仪表板
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // 如果正在加载或用户已登录，可以显示一个加载状态或直接不渲染任何内容
  if (loading || user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">正在加载...</p>
      </div>
    );
  }

  // 只在用户未登录时显示主页内容
  return (
    <div className="min-h-screen bg-background">
      <header className="absolute top-0 left-0 right-0 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">PicHub</h1>
          <nav className="space-x-4">
            <Button asChild variant="ghost">
              <Link href="/login">登录</Link>
            </Button>
            <Button asChild>
              <Link href="/register">注册</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-8 pt-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            现代化、可自托管的图床解决方案
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            点击或拖拽上传图片，支持 JPG、JPEG、PNG、GIF、WebP 等格式。您也可以直接 `Ctrl+V` 粘贴剪贴板中的图片。
          </p>
        </div>
        
        <div className="w-full max-w-2xl">
          <UploadZone />
        </div>
      </main>

      <footer className="text-center p-4 text-sm text-muted-foreground">
        <p>
          由 <a href="https://github.com/truman-world/pichub" target="_blank" rel="noopener noreferrer" className="underline">PicHub</a> 强力驱动. 基于 MIT 协议开源.
        </p>
      </footer>
    </div>
  );
}
