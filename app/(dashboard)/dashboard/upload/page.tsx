// app/(dashboard)/dashboard/upload/page.tsx
import { UploadZone } from '@/components/upload/upload-zone'

export default function UploadPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">上传图片</h1>
        <p className="text-muted-foreground mt-2">
          拖拽或选择图片进行上传
        </p>
      </div>

      <UploadZone />
    </div>
  )
}