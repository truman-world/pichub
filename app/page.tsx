/*
 * ==========================================
 * 更新文件: app/page.tsx
 * ==========================================
 * 主页现在从新的、正确的路径导入 UploadZone 组件。
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UploadZone, ImageSettings } from '@/components/upload-zone'; // 导入我们创建的新组件
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Settings } from 'lucide-react';


export default function HomePage() {
  const [settings, setSettings] = useState<ImageSettings>({
    compress: true,
    quality: 90,
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="px-4 lg:px-6 h-14 flex items-center shadow-sm border-b">
        <Link href="/" className="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
          <span className="ml-2 text-lg font-semibold">PicHub</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button asChild variant="ghost">
            <Link href="/login">登录</Link>
          </Button>
          <Button asChild>
            <Link href="/register">注册</Link>
          </Button>
        </nav>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">现代化、开源、可自托管的图床</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            轻松上传、管理和分享您的图片，数据完全由您掌控。
          </p>
        </div>

        <UploadZone settings={settings} />

        <div className="mt-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                图片处理设置
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>图片处理设置</DialogTitle>
                <DialogDescription>
                  配置您的图片上传和处理偏好。
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="compress-switch" className="flex flex-col gap-1">
                    <span>压缩并转换为WebP</span>
                    <span className="text-xs font-normal text-gray-500">移除元数据并显著减小文件大小</span>
                  </Label>
                  <Switch
                    id="compress-switch"
                    checked={settings.compress}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, compress: checked }))}
                  />
                </div>
                {settings.compress && (
                    <div className="grid gap-2">
                         <Label htmlFor="quality-slider">压缩质量: <span className="font-bold">{settings.quality}</span></Label>
                         <Slider
                            id="quality-slider"
                            min={50}
                            max={100}
                            step={5}
                            value={[settings.quality]}
                            onValueChange={(value) => setSettings(prev => ({ ...prev, quality: value[0] }))}
                         />
                         <div className="flex justify-between text-xs text-gray-500">
                             <span>较低质量</span>
                             <span>高质量</span>
                             <span>无损</span>
                         </div>
                    </div>
                )}
                 <div className="opacity-50">
                    <Label className="flex flex-col gap-1">
                        <span>水印设置 (规划中)</span>
                        <span className="text-xs font-normal text-gray-500">自动为上传的图片添加水印标识</span>
                    </Label>
                 </div>
                 <div className="opacity-50">
                    <Label className="flex flex-col gap-1">
                        <span>便捷功能 (规划中)</span>
                        <span className="text-xs font-normal text-gray-500">自动复制链接、自动删除等</span>
                    </Label>
                 </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>

       <footer className="text-center p-4 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} PicHub. Your Modern Image Hub.
      </footer>
    </div>
  );
}
