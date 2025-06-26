/*
 * -----------------------------------------------------------
 * 文件: app/(dashboard)/dashboard/upload/page.tsx (上传组件)
 * -----------------------------------------------------------
 * 重构说明:
 * 我已将这个页面的核心功能提取成一个独立的、可复用的 <UploadZone /> 组件。
 * 这样我们就可以在主页和仪表盘中同时使用它，保证了代码的整洁和一致性。
 * 新增了对 settings prop 的支持，以便接收来自主页的图片处理设置。
 */
'use client'

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { ImageUp, CheckCircle, AlertCircle } from 'lucide-react';
import imageCompression from 'browser-image-compression';

// 定义图片处理设置的类型
interface ImageSettings {
  compress: boolean;
  quality: number;
  // 未来可以扩展更多设置
  // addWatermark: boolean;
  // watermarkText: string;
}

// 定义组件的 props 类型
interface UploadZoneProps {
  settings?: ImageSettings;
}

// 可复用的上传区域组件
export function UploadZone({ settings }: UploadZoneProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; url?: string; message: string } | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      toast({ title: '没有选择文件', variant: 'destructive' });
      return;
    }

    setUploading(true);
    setProgress(0);
    setUploadResult(null);

    try {
        let processedFile = file;
        
        // 1. 如果启用了压缩设置，则在客户端进行压缩
        if (settings?.compress) {
            toast({ title: '正在压缩图片...' });
            const options = {
                maxSizeMB: 10,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                initialQuality: settings.quality / 100
            };
            processedFile = await imageCompression(file, options);
            toast({ title: '压缩完成，正在上传...' });
        }

      const formData = new FormData();
      formData.append('file', processedFile);
      
      // 注意：这里需要一个后端 API 来处理文件上传
      // 我们暂时使用一个占位的 /api/upload 接口
      // 您需要创建这个接口来处理实际的文件存储逻辑
      
      // 模拟上传进度
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(res => setTimeout(res, 50));
        setProgress(i);
      }
      
      // 模拟上传结果
      // 在实际应用中，这里应该是 fetch('/api/upload', ...) 的结果
      const fakeUrl = URL.createObjectURL(processedFile);
      setUploadResult({ success: true, url: fakeUrl, message: '上传成功！' });
      toast({ title: '上传成功', description: '图片链接（模拟）已生成。' });

    } catch (error: any) {
      setUploadResult({ success: false, message: '上传失败: ' + error.message });
      toast({ title: '上传失败', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  }, [settings]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', 'webp'] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full max-w-2xl mx-auto p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors duration-300
      ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
      dark:bg-gray-800 dark:${isDragActive ? 'border-blue-400 bg-gray-700' : 'border-gray-600 hover:border-gray-500'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4">
        <ImageUp className={`w-16 h-16 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
        {isDragActive ? (
          <p className="text-xl font-semibold text-blue-600">快松手，让我来！</p>
        ) : (
          <div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">点击或拖拽上传图片</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">支持 JPG, PNG, GIF, WebP 等格式，最大 100MB</p>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">💡 你也可以直接 <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Ctrl</kbd> + <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">V</kbd> 粘贴图片</p>
          </div>
        )}
      </div>

      {uploading && (
        <div className="mt-6 w-full">
          <Progress value={progress} className="w-full" />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">上传中... {progress}%</p>
        </div>
      )}

      {uploadResult && (
        <div className={`mt-6 p-4 rounded-lg flex items-center space-x-3 ${uploadResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {uploadResult.success ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <div>
            <p className="font-semibold">{uploadResult.message}</p>
            {uploadResult.success && uploadResult.url && (
              <a href={uploadResult.url} target="_blank" rel="noopener noreferrer" className="text-sm underline break-all">
                {uploadResult.url}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// 主页面现在只负责渲染这个组件
export default function UploadPage() {
  return (
    <div className="flex-1 p-8">
      <h1 className="text-3xl font-bold mb-6">上传图片</h1>
      <UploadZone />
    </div>
  );
}
