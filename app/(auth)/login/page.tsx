/*
 * =================================================
 * 更新文件: app/(auth)/login/page.tsx
 * =================================================
 * 修复说明:
 * 1. 在登录成功后，不再仅仅是提示，而是会立即执行页面跳转。
 * 2. 使用 router.refresh() 强制刷新客户端状态，确保 token 生效。
 * 3. 根据后端返回的用户角色，精确地将管理员跳转到 /dashboard，普通用户跳转到主页 /。
 */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || '用户名或密码错误');
      }
      
      toast({
        title: '登录成功',
        description: '欢迎回来!',
      });
      
      // 关键修复: 强制刷新页面以同步认证状态
      router.refresh();

      // 关键修复: 根据角色进行精确跳转
      if (data.user.role === 'ADMIN') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }

    } catch (error: any) {
      toast({
        title: '登录失败',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">登录</CardTitle>
          <CardDescription>输入您的用户名以登录您的账户</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">用户名</Label>
                <Input id="username" type="text" placeholder="admin" required value={username} onChange={(e) => setUsername(e.target.value)} disabled={isLoading}/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">密码</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading}/>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? '登录中...' : '登录'}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            还没有账户?{' '}
            <Link href="/register" className="underline">注册</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
