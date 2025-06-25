// app/(dashboard)/dashboard/gallery/page.tsx
"use client"

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Search, Eye, Download, Trash2, Copy, ExternalLink } from 'lucide-react'
import { formatBytes, formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/components/ui/use-toast'
import { Image as ImageType } from '@/types'
import Link from 'next/link'

export default function GalleryPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [images, setImages] = useState<ImageType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)

  const fetchImages = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // TODO: 从我们自己的 API 获取图片数据
      // const response = await fetch('/api/images');
      // const data = await response.json();
      // setImages(data);
    } catch (error) {
      console.error('Failed to fetch images:', error)
      toast({
        title: "加载失败",
        description: "无法加载图片列表",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [user, toast]);

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  const handleDelete = async (image: ImageType) => {
    if (!confirm('确定要删除这张图片吗？')) return

    try {
      // TODO: 调用我们自己的删除API
      // await fetch(`/api/images/${image.id}`, { method: 'DELETE' });

      setImages(images.filter(img => img.id !== image.id))
      
      toast({
        title: "删除成功",
        description: "图片已被删除"
      })
    } catch (error) {
      toast({
        title: "删除失败",
        description: "无法删除图片",
        variant: "destructive"
      })
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "复制成功",
        description: "链接已复制到剪贴板"
      })
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive"
      })
    }
  }

  const downloadImage = async (image: ImageType) => {
    try {
      const response = await fetch(image.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = image.originalName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      toast({
        title: "下载失败",
        description: "无法下载图片",
        variant: "destructive"
      })
    }
  }

  const filteredImages = images.filter(image =>
    image.originalName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">图库</h1>
        <p className="text-muted-foreground mt-2">
          管理您上传的所有图片
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="搜索图片..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-muted"></div>
            </Card>
          ))}
        </div>
      ) : filteredImages.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            {searchQuery ? '没有找到匹配的图片' : '还没有上传任何图片'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <Card key={image.id} className="group overflow-hidden">
              <div className="relative aspect-square">
                <img
                  src={image.thumbnailUrl || image.url}
                  alt={image.originalName}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => {
                    setSelectedImage(image)
                    setViewModalOpen(true)
                  }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => {
                      setSelectedImage(image)
                      setViewModalOpen(true)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => copyToClipboard(image.url)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => downloadImage(image)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(image)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate">{image.originalName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(image.size)} · {formatDate(image.createdAt)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedImage?.originalName}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.originalName}
                  className="w-full rounded-lg"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => window.open(selectedImage.url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">尺寸</p>
                  <p className="font-medium">{selectedImage.width} × {selectedImage.height}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">大小</p>
                  <p className="font-medium">{formatBytes(selectedImage.size)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">格式</p>
                  <p className="font-medium uppercase">{selectedImage.format}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">上传时间</p>
                  <p className="font-medium">{formatDate(selectedImage.createdAt)}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">图片链接</p>
                <div className="flex space-x-2">
                  <Input value={selectedImage.url} readOnly />
                  <Button onClick={() => copyToClipboard(selectedImage.url)}>
                    复制
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}