// app/(dashboard)/dashboard/albums/page.tsx
"use client"

import { useEffect, useState, useCallback } from 'react' // useCallback has been added
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, FolderOpen, Edit, Trash2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/components/ui/use-toast'
import { Album } from '@/types'
import { useRouter } from 'next/navigation'

export default function AlbumsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: true
  })

  const fetchAlbums = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // TODO: 从我们自己的 API 获取相册数据
      // const response = await fetch('/api/albums');
      // if (!response.ok) throw new Error('Failed to fetch albums');
      // const data = await response.json();
      // setAlbums(data);
    } catch (error) {
      console.error('Failed to fetch albums:', error)
      toast({
        title: "加载失败",
        description: "无法加载相册列表",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [user, toast]);

  useEffect(() => {
    fetchAlbums()
  }, [fetchAlbums])

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "错误",
        description: "相册名称不能为空",
        variant: "destructive"
      })
      return
    }

    const endpoint = editingAlbum ? `/api/albums/${editingAlbum.id}` : '/api/albums';
    const method = editingAlbum ? 'PUT' : 'POST';

    try {
      // TODO: 调用我们自己的创建/更新 API
      // const response = await fetch(endpoint, {
      //   method,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      // if (!response.ok) throw new Error(editingAlbum ? '更新失败' : '创建失败');

      toast({
        title: editingAlbum ? "更新成功" : "创建成功",
        description: `相册 "${formData.name}" 已保存.`
      })
      
      setCreateModalOpen(false)
      setEditingAlbum(null)
      setFormData({ name: '', description: '', isPublic: true })
      fetchAlbums()
    } catch (error) {
      toast({
        title: editingAlbum ? "更新失败" : "创建失败",
        description: "操作失败，请重试",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (album: Album) => {
    if (!confirm('确定要删除这个相册吗？相册中的图片不会被删除。')) return

    try {
        // TODO: 调用我们自己的删除 API
      // await fetch(`/api/albums/${album.id}`, { method: 'DELETE' });
      
      setAlbums(albums.filter(a => a.id !== album.id))
      
      toast({
        title: "删除成功",
        description: "相册已被删除"
      })
    } catch (error) {
      toast({
        title: "删除失败",
        description: "无法删除相册",
        variant: "destructive"
      })
    }
  }

  const openEditModal = (album: Album) => {
    setEditingAlbum(album)
    setFormData({
      name: album.name,
      description: album.description || '',
      isPublic: album.isPublic
    })
    setCreateModalOpen(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">相册</h1>
          <p className="text-muted-foreground mt-2">
            整理和管理您的图片集合
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          创建相册
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-video bg-muted"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : albums.length === 0 ? (
        <Card className="p-12 text-center">
          <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">还没有创建任何相册</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setCreateModalOpen(true)}
          >
            创建第一个相册
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {albums.map((album) => (
            <Card 
              key={album.id} 
              className="group cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div 
                className="aspect-video bg-muted relative overflow-hidden"
                onClick={() => router.push(`/dashboard/albums/${album.id}`)}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <FolderOpen className="h-16 w-16 text-muted-foreground/50" />
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation()
                      openEditModal(album)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(album)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium truncate">{album.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {album.imageCount} 张图片
                </p>
                {album.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {album.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={createModalOpen} onOpenChange={(open) => {
        setCreateModalOpen(open)
        if (!open) {
          setEditingAlbum(null)
          setFormData({ name: '', description: '', isPublic: true })
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAlbum ? '编辑相册' : '创建相册'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">相册名称</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="输入相册名称"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">相册描述</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="输入相册描述（可选）"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="isPublic" className="cursor-pointer">
                公开相册（其他人可以查看）
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>
              {editingAlbum ? '保存' : '创建'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
