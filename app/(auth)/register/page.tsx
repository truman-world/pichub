/*
 * =================================================
 * 更新文件: app/(auth)/register/page.tsx
 * =================================================
 * 修复说明:
 * 1. 注册成功后，自动将用户重定向到登录页面，引导他们立即登录。
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

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || '注册时发生未知错误');
      }
      toast({ title: '注册成功', description: data.message });
      // 关键修复: 注册成功后自动跳转
      router.push('/login');
    } catch (error: any) {
      toast({ title: '注册失败', description: error.message, variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">创建账户</CardTitle>
          <CardDescription>输入您的信息以完成注册</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">用户名</Label>
                <Input id="username" type="text" placeholder="设置一个独特的用户名" required value={username} onChange={(e) => setUsername(e.target.value)} disabled={isLoading}/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">邮箱</Label>
                <Input id="email" type="email" placeholder="your@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading}/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">密码</Label>
                <Input id="password" type="password" required placeholder="至少6位" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading}/>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? '注册中...' : '立即注册'}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            已经有账户了?{' '}
            <Link href="/login" className="underline">直接登录</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
