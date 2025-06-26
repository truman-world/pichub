// components/Uploader.tsx
import React, { useState, useRef } from 'react';

export default function Uploader() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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

      if (!response.ok) {
        throw new Error(data.message || '上传失败');
      }

      // 上传成功，设置返回的永久 URL
      setUploadedImageUrl(data.url);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      // 清空 input 的值，以便可以再次上传同一个文件
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div style={{ border: '2px dashed #ccc', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
      <h2>上传您的图片</h2>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={uploading}
        accept="image/*"
        style={{ display: 'block', margin: '20px auto' }}
      />
      {uploading && <p>正在上传中...</p>}
      {error && <p style={{ color: 'red' }}>错误: {error}</p>}
      {uploadedImageUrl && (
        <div>
          <p style={{ color: 'green' }}>上传成功!</p>
          <img src={uploadedImageUrl} alt="Uploaded preview" style={{ maxWidth: '100%', maxHeight: '300px', marginTop: '10px' }} />
          <p>图片网址: <a href={uploadedImageUrl} target="_blank" rel="noopener noreferrer">{uploadedImageUrl}</a></p>
        </div>
      )}
    </div>
  );
}
