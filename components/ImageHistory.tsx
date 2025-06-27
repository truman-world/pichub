// components/ImageHistory.tsx
import React, { useState } from 'react';
import type { Image } from '@prisma/client';

// 嵌入代码组件
const EmbedCodes: React.FC<{ url: string }> = ({ url }) => {
  const [format, setFormat] = useState('URL');
  const codes = {
    URL: url,
    HTML: `<img src="${url}" alt="Image from PicHub" />`,
    Markdown: `![Image from PicHub](${url})`,
    BBCode: `[img]${url}[/img]`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(codes[format as keyof typeof codes]);
      alert('已复制!');
    } catch (err) {
      alert('复制失败!');
    }
  };

  return (
    <div className="mt-2">
      <div className="flex gap-1 border border-slate-200 rounded-md p-1 bg-slate-100">
        {(Object.keys(codes) as Array<keyof typeof codes>).map(f => (
          <button key={f} onClick={() => setFormat(f)} className={`px-3 py-1 text-xs rounded-md transition-colors ${format === f ? 'bg-white shadow-sm text-sky-600' : 'text-slate-500 hover:bg-slate-200'}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <input type="text" readOnly value={codes[format as keyof typeof codes]} className="flex-grow p-2 text-sm border rounded bg-white" />
        <button onClick={copyToClipboard} className="px-3 py-2 text-sm bg-slate-200 hover:bg-slate-300 rounded-md">复制</button>
      </div>
    </div>
  );
};


export default function ImageHistory({ initialImages }: { initialImages: Image[] }) {
    if (initialImages.length === 0) {
        return <p className="mt-8 text-center text-slate-500">登录后可查看上传历史</p>;
    }

    return (
        <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-700">最近上传</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {initialImages.map(image => (
                    <div key={image.id} className="bg-white p-4 rounded-lg border shadow-sm">
                        <div className="flex items-center gap-4">
                            <img src={image.url} alt={image.originalName} className="w-24 h-24 object-cover rounded-md" />
                            <div className="flex-grow overflow-hidden">
                                <p className="text-sm font-medium text-slate-800 truncate" title={image.originalName}>{image.originalName}</p>
                                <p className="text-xs text-slate-500">{new Date(image.createdAt).toLocaleString()}</p>
                                <p className="text-xs text-slate-500">{(image.size / 1024).toFixed(2)} KB</p>
                            </div>
                        </div>
                        <EmbedCodes url={new URL(image.url, 'http://8.148.7.13:3000').href} />
                    </div>
                ))}
            </div>
        </div>
    );
}
