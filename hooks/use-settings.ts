// hooks/use-settings.ts
import { useEffect, useState } from 'react';
import { SystemSettings } from '@/types'; // 确保你已经创建了 types/index.ts

export function useSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // TODO: 从我们自己的 API 获取设置
        // const response = await fetch('/api/settings');
        // const data = await response.json();
        // setSettings(data);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // 暂时返回完整的默认设置，补全所有属性
  return {
    settings: settings || {
      siteName: 'PicHub',
      enableRegistration: true,
      requireInviteCode: false,
      enableGuestUpload: true,
      enablePublicGallery: true,
      maxUploadSize: 10485760,
      allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      imageQuality: 85,
      enableCompression: true,
      compressionQuality: 80,
      enableWatermark: false,
      watermarkText: '',
      watermarkPosition: 'bottom-right',
      minWidth: 0,
      minHeight: 0,
      maxWidth: 1920, // 补全 maxWidth
      maxHeight: 1080, // 补全 maxHeight
      enableThumbnails: true,
      thumbnailSize: 200,
      dailyUploadLimit: 100,
      ipBlacklist: [],
      storageConfig: {},
      updatedAt: new Date().toISOString(),
    },
    loading,
    refetch: () => {},
  };
}
