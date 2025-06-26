/*
 * ========================================================
 * 更新文件: app/(dashboard)/dashboard/upload/page.tsx
 * ========================================================
 * 这个文件现在变得非常简洁，它只负责导入并渲染 UploadZone 组件。
 */
import { UploadZone } from '@/components/upload-zone';

export default function UploadPage() {
  return (
    <div className="flex-1 p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">上传图片</h1>
      <UploadZone />
    </div>
  );
}
