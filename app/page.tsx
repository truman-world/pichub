/*
 * ==========================================
 * 更新文件: app/page.tsx (全新主页)
 * ==========================================
 * 功能说明:
 * 1. 彻底重构了主页，使其成为一个无需登录即可使用的快速上传中心。
 * 2. 集成了 UploadZone 组件，并实现了您设计的 "图片处理设置" 功能。
 * 3. 新增了 UploadResult 组件，用于在上传成功后，以多种格式（URL, HTML, BBCode, Markdown）展示图片链接，并提供一键复制功能。
 * 4. 实现了基于浏览器 localStorage 的 "历史记录" 功能，可以保存和查看最近的上传。
 * 5. 增加了对 "游客上传存储策略" 和 "自动删除" 的 UI 占位符，为未来功能迭代做好了准备。
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UploadZone, ImageSettings } from '@/components/upload-zone';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Settings, Copy, Trash2, Image as ImageIcon, Link2 } from 'lucide-react';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

// 定义上传结果的类型
type UploadResultData = {
  url: string;
  name: string;
  timestamp: number;
};

// 链接结果组件
function UploadResult({ result, onCopy }: { result: UploadResultData, onCopy: (text: string) => void }) {
  const imageUrl = result.url;
  const linkFormats = {
    url: imageUrl,
    html: `<img src="${imageUrl}" alt="${result.name}" />`,
    bbcode: `[img]${imageUrl}[/img]`,
    markdown: `![${result.name}](${imageUrl})`
  };

  return (
    <div className="mt-4 w-full p-4 border rounded-lg bg-background">
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="url">URL</TabsTrigger>
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="bbcode">BBCode</TabsTrigger>
          <TabsTrigger value="markdown">Markdown</TabsTrigger>
        </TabsList>
        {Object.entries(linkFormats).map(([key, value]) => (
          <TabsContent key={key} value={key}>
            <div className="relative">
              <Input readOnly value={value} className="pr-10" />
              <Button size="icon" variant="ghost" className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8" onClick={() => onCopy(value)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// 首页组件
export default function HomePage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ImageSettings>({ compress: true, quality: 90 });
  const [uploadHistory, setUploadHistory] = useState<UploadResultData[]>([]);
  const [lastUpload, setLastUpload] = useState<UploadResultData | null>(null);

  // 从 localStorage 加载历史记录
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('pichub_guest_history');
      if (storedHistory) {
        setUploadHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse upload history from localStorage", e);
    }
  }, []);

  // 将历史记录保存到 localStorage
  const saveHistory = (history: UploadResultData[]) => {
    try {
        localStorage.setItem('pichub_guest_history', JSON.stringify(history));
    } catch(e) {
        console.error("Failed to save upload history to localStorage", e);
    }
  };

  const handleUploadSuccess = (result: Omit<UploadResultData, 'timestamp'>) => {
    const newUpload: UploadResultData = { ...result, timestamp: Date.now() };
    const newHistory = [newUpload, ...uploadHistory].slice(0, 10); // 只保留最近10条
    setUploadHistory(newHistory);
    saveHistory(newHistory);
    setLastUpload(newUpload);
  };
  
  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: '成功', description: '链接已复制到剪贴板！' });
    }).catch(err => {
      toast({ title: '失败', description: '无法复制链接，请手动复制。', variant: 'destructive' });
    });
  }, [toast]);
  
  const clearHistory = () => {
      setUploadHistory([]);
      localStorage.removeItem('pichub_guest_history');
      toast({title: '成功', description: '上传历史已清空。'});
  }

  // 初始化检查
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  useEffect(() => {
    async function checkInit() {
      // 这是一个简单的客户端检查，以避免不必要的API调用
      // 真正的重定向逻辑在服务器端更可靠
      // 我们在服务器端组件中处理这个问题
    }
    checkInit();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="px-4 lg:px-6 h-14 flex items-center shadow-sm border-b">
        <Link href="/" className="flex items-center justify-center font-semibold">
          <ImageIcon className="h-6 w-6 mr-2" /> PicHub
        </Link>
        <nav className="ml-auto flex gap-2 sm:gap-4">
          <Button asChild variant="ghost"><Link href="/login">登录</Link></Button>
          <Button asChild><Link href="/register">注册</Link></Button>
        </nav>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center my-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">现代化、开源、可自托管的图床</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            轻松上传、管理和分享您的图片，数据完全由您掌控。
          </p>
        </div>

        <div className="w-full max-w-3xl">
          <UploadZone settings={settings} onUploadSuccess={handleUploadSuccess} />
          {lastUpload && <UploadResult result={lastUpload} onCopy={handleCopy} />}
        </div>
        
        <div className="mt-6">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline"><Settings className="mr-2 h-4 w-4" />图片处理设置</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>图片处理设置</DialogTitle>
                        <DialogDescription>配置您的图片上传和处理偏好。</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="compress-switch" className="flex flex-col gap-1"><span>压缩并转换为WebP</span><span className="text-xs font-normal text-gray-500">移除元数据并显著减小文件大小</span></Label>
                            <Switch id="compress-switch" checked={settings.compress} onCheckedChange={(c) => setSettings(p => ({ ...p, compress: c }))}/>
                        </div>
                        {settings.compress && (<div className="grid gap-2">
                            <Label>压缩质量: <span className="font-bold">{settings.quality}</span></Label>
                            <Slider min={50} max={100} step={5} value={[settings.quality]} onValueChange={(v) => setSettings(p => ({ ...p, quality: v[0] }))}/>
                            <div className="flex justify-between text-xs text-gray-500"><span>较低</span><span>默认</span><span>无损</span></div>
                        </div>)}
                        <div className="opacity-50 space-y-2"><Label>游客存储策略 (管理员设置)</Label><p className="text-xs text-gray-500">当前存储至: 默认存储</p></div>
                        <div className="opacity-50 space-y-2"><Label>自动删除 (规划中)</Label><p className="text-xs text-gray-500">上传的图片永不过期</p></div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>

        {uploadHistory.length > 0 && (
          <div className="w-full max-w-3xl mt-12">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">历史上传</h2>
                <Button variant="ghost" size="sm" onClick={clearHistory}><Trash2 className="mr-2 h-4 w-4"/>清空历史</Button>
            </div>
            <div className="space-y-3">
              {uploadHistory.map((item) => (
                <div key={item.timestamp} className="flex items-center justify-between p-3 bg-background border rounded-lg">
                  <div className="flex items-center gap-3">
                    <img src={item.url} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                    <div className="flex flex-col">
                      <span className="font-medium text-sm truncate max-w-xs">{item.name}</span>
                      <span className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleCopy(item.url)}><Link2 className="mr-2 h-4 w-4" />复制链接</Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

       <footer className="text-center p-4 text-sm text-gray-500 border-t">
        &copy; {new Date().getFullYear()} PicHub. Your Modern Image Hub.
      </footer>
    </div>
  );
}
