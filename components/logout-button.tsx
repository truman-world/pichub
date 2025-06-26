/*
 * ==========================================
 * 新文件: components/logout-button.tsx
 * ==========================================
 * 这是一个客户端组件，专门用于处理登出逻辑，
 * 以避免在服务端组件中混入客户端交互。
 */
'use client';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        // 创建一个用于删除cookie的API
        await fetch('/api/auth/logout', { method: 'POST' });
        router.refresh();
        router.push('/');
    };

    return (
        <DropdownMenuItem onClick={handleLogout}>
            退出登录
        </DropdownMenuItem>
    );
}
