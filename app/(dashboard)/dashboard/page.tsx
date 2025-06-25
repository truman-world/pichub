// app/(dashboard)/dashboard/page.tsx
"use client"

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UploadCloud, Image, FolderOpen, HardDrive } from 'lucide-react'
import { formatBytes } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Stats {
  totalImages: number
  totalAlbums: number
  storageUsed: number
  todayUploads: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({
    totalImages: 0,
    totalAlbums: 0,
    storageUsed: 0,
    todayUploads: 0
  })
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // TODO: 从我们自己的 API 获取统计数据
      // const response = await fetch('/api/stats');
      // const data = await response.json();
      // setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }, [user]);

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const statsCards = [
    {
      title: '总图片数',
      value: stats.totalImages.toString(),
      icon: Image,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: '相册数量',
      value: stats.totalAlbums.toString(),
      icon: FolderOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      title: '已用存储',
      value: formatBytes(stats.storageUsed),
      icon: HardDrive,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      title: '今日上传',
      value: stats.todayUploads.toString(),
      icon: UploadCloud,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">仪表板</h1>
        <p className="text-muted-foreground mt-2">
          欢迎回来，{user?.username || user?.email}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={cn("rounded-lg p-2", stat.bgColor)}>
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>快速开始</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Link href="/dashboard/upload">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <UploadCloud className="h-8 w-8 text-primary mb-2" />
                <p className="font-medium">上传图片</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/gallery">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Image className="h-8 w-8 text-primary mb-2" />
                <p className="font-medium">浏览图库</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/albums">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <FolderOpen className="h-8 w-8 text-primary mb-2" />
                <p className="font-medium">管理相册</p>
              </CardContent>
            </Card>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}