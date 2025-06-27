// components/Uploader.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

// SVG 图标组件
const CloudIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-4-4h1a3 3 0 003-3h1a2 2 0 012-2h4a2 2 0 012 2h1a3 3 0 003 3h1a4 4 0 01-4 4H7z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v9m0 0l-2-2m2 2l2-2" />
    </svg>
);
const FolderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
    </svg>
);


export default function Uploader() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setUploadedImageUrl('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || '上传失败');
      setUploadedImageUrl(data.url);
      // 自动复制链接
      await navigator.clipboard.writeText(data.url);
      alert('上传成功，链接已自动复制到剪贴板！');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }, []);
  
  // 处理粘贴上传
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            onDrop([file]);
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: false,
  });

  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border">
        {/* 上传区域 */}
        <div {...getRootProps()} className={`relative group w-full h-48 flex justify-center items-center border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ease-in-out ${isDragActive ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50 hover:border-sky-400'}`}>
            <input {...getInputProps()} />
            <div className="text-center space-y-2">
                <div className="relative h-12 w-12 mx-auto">
                    <div className={`absolute inset-0 transition-opacity duration-300 ${isDragActive ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'}`}>
                        <CloudIcon />
                    </div>
                    <div className={`absolute inset-0 transition-opacity duration-300 ${isDragActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <FolderIcon />
                    </div>
                </div>
                <p className="text-slate-600">
                    {isDragActive ? '松开即可上传' : '点击或拖拽上传图片'}
                </p>
                <p className="text-xs text-slate-400">支持粘贴 (Ctrl+V)，最大 100MB</p>
            </div>
        </div>

        {/* 状态显示 */}
        {uploading && <p className="mt-4 text-center text-blue-600">正在上传中...</p>}
        {error && <p className="mt-4 text-center text-red-600">错误: {error}</p>}
        {uploadedImageUrl && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-semibold text-green-800">上传成功!</p>
                <div className="flex items-center gap-4 mt-2">
                    <img src={uploadedImageUrl} alt="Uploaded preview" className="w-20 h-20 object-cover rounded" />
                    <input type="text" readOnly value={uploadedImageUrl} className="flex-grow p-2 border rounded bg-white" />
                </div>
            </div>
        )}

        {/* 高级设置 (UI占位) */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-slate-700">图片处理设置</h3>
          <div className="mt-4 space-y-4 p-4 bg-slate-100/50 rounded-lg">
             <div>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" className="rounded"/>
                  移除图片元数据 (EXIF)
                </label>
             </div>
             <div>
                <label className="text-sm text-slate-600 block mb-1">压缩质量: <strong>100%</strong> (无损)</label>
                <input type="range" min="50" max="100" defaultValue="100" className="w-full" />
             </div>
             <div>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" className="rounded"/>
                  添加水印
                </label>
             </div>
          </div>
        </div>
    </section>
  );
}
