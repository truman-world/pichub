// components/upload/upload-zone.tsx
"use client"

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileImage } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatBytes } from '@/lib/utils'
import { processImage } from '@/lib/image-utils'
import { useSettings } from '@/hooks/use-settings'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/hooks/use-auth' // 引入我们自己的 useAuth hook

interface UploadFile {
  file: File
  preview: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

export function UploadZone() {
  const [files, setFiles] = useState<UploadFile[]>([])
  const { settings } = useSettings()
  const { toast } = useToast()
  const { user } = useAuth() // 使用我们自己的 hook 获取用户信息

  const uploadImage = useCallback(async (uploadFile: UploadFile) => {
    if (!user) {
      toast({ title: "请先登录", variant: "destructive" });
      return;
    }
    
    try {
      updateFileStatus(uploadFile.file.name, 'uploading', 0)

      const processedFile = await processImage(uploadFile.file, {
        maxWidth: settings?.maxWidth,
        maxHeight: settings?.maxHeight,
        quality: settings?.imageQuality ? settings.imageQuality / 100 : 0.85,
        enableCompression: settings?.enableCompression
      })

      // 使用 FormData 来准备上传
      const formData = new FormData();
      formData.append('image', processedFile);
      // 您可以在这里添加其他信息，比如相册ID
      // formData.append('albumId', 'some-album-id');

      // TODO: 调用我们自己的后端上传 API
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      //   // 这里可能需要一个 onUploadProgress 的实现来更新进度条
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.error || '上传失败');
      // }
      
      // const result = await response.json();

      // 模拟上传成功
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟
      updateFileStatus(uploadFile.file.name, 'success', 100)
      
      toast({
        title: "上传成功 (模拟)",
        description: `${uploadFile.file.name} 已成功上传。`
      })
    } catch (error: any) {
      updateFileStatus(uploadFile.file.name, 'error', 0, error.message)
      
      toast({
        title: "上传失败",
        description: error.message,
        variant: "destructive"
      })
    }
  }, [user, settings, toast]);


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'pending' as const
    }))
    
    setFiles(prev => [...prev, ...newFiles])
    
    for (const uploadFile of newFiles) {
      await uploadImage(uploadFile)
    }
  }, [uploadImage])


  const updateFileStatus = (
    filename: string, 
    status: UploadFile['status'], 
    progress: number, 
    error?: string
  ) => {
    setFiles(prev => prev.map(f => 
      f.file.name === filename 
        ? { ...f, status, progress, error }
        : f
    ))
  }

  const removeFile = (filename: string) => {
    setFiles(prev => prev.filter(f => f.file.name !== filename))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': settings?.allowedFormats?.map(f => `.${f}`) || ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    },
    maxSize: settings?.maxUploadSize || 10 * 1024 * 1024
  })

  return (
    <div className="space-y-4">
      <Card
        {...getRootProps()}
        className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-2">
          {isDragActive ? '放开以上传' : '拖拽图片到此处，或点击选择'}
        </p>
        <p className="text-sm text-muted-foreground">
          支持 {settings?.allowedFormats?.join(', ')} 格式，单个文件最大 {formatBytes(settings?.maxUploadSize || 10485760)}
        </p>
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map(file => (
            <Card key={file.file.name} className="p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={file.preview}
                  alt={file.file.name}
                  className="h-16 w-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatBytes(file.file.size)}
                  </p>
                  {file.status === 'uploading' && (
                    <Progress value={file.progress} className="h-2 mt-2" />
                  )}
                   {file.status === 'success' && (
                    <p className="text-sm text-green-600 mt-1">上传成功</p>
                  )}
                  {file.status === 'error' && (
                    <p className="text-sm text-destructive mt-1">{file.error}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(file.file.name)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
