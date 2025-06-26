/*
 * ==========================================
 * 新文件: components/upload-zone.tsx
 * ==========================================
 * 这是我们新的、可复用的核心上传组件。
 * 请在项目根目录下创建 components/ 目录 (如果尚不存在)，
 * 然后在该目录下创建 upload-zone.tsx 文件，并将以下内容粘贴进去。
 */
'use client'

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { ImageUp, CheckCircle, AlertCircle } from 'lucide-react';
import imageCompression from 'browser-image-compression';

// 定义图片处理设置的类型
export interface ImageSettings {
  compress: boolean;
  quality: number;
}

// 定义组件的 props 类型
interface UploadZoneProps {
  settings?: ImageSettings;
}

export function UploadZone({ settings }: UploadZoneProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; url?: string; message: string } | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setUploadResult(null);

    try {
      let processedFile = file;
      
      if (settings?.compress) {
        toast({ title: '正在压缩图片...' });
        const options = {
          maxSizeMB: 10,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          initialQuality: settings.quality / 100,
        };
        processedFile = await imageCompression(file, options);
        toast({ title: '压缩完成，正在上传...' });
      }

      const formData = new FormData();
      formData.append('file', processedFile);
      
      // 模拟上传
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(res => setTimeout(res, 50));
        setProgress(i);
      }
      
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

  // 粘贴图片的处理逻辑
  const handlePaste = useCallback((event: React.ClipboardEvent) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            if(file) {
                onDrop([file]);
            }
            break;
        }
    }
  }, [onDrop]);

  return (
    <div
      {...getRootProps()}
      onPaste={handlePaste}
      tabIndex={0} // Make it focusable to receive paste events
      className={`w-full max-w-2xl mx-auto p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500
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
