// components/user-nav.tsx
/*
 * 这是一个服务端组件 (Server Component), 它会根据用户的登录状态，
 * 自动显示“登录/注册”按钮，或用户的头像下拉菜单。
 */
import { getAuth } from '@/lib/auth-app'; // --- 核心修复：从新的认证文件导入 ---
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default async function UserNav() {
    const user = await getAuth();

    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <Button asChild>
                    <Link href="/login">登录</Link>
                </Button>
                <Button variant="secondary" asChild>
                    <Link href="/register">注册</Link>
                </Button>
            </div>
        );
    }

    // 如果用户已登录
    const fallbackInitial = user.username ? user.username.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-9 w-9">
                        {/* 可以添加用户头像URL */}
                        {/* <AvatarImage src={user.avatarUrl} alt={`@${user.username}`} /> */}
                        <AvatarFallback>{fallbackInitial}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.username}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link href="/dashboard">
                        <DropdownMenuItem>
                            仪表盘
                        </DropdownMenuItem>
                    </Link>
                    {user.role === 'ADMIN' && (
                         <Link href="/admin/dashboard">
                            <DropdownMenuItem>
                                管理后台
                            </DropdownMenuItem>
                        </Link>
                    )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <a href="/api/logout">
                    <DropdownMenuItem>
                        退出登录
                    </DropdownMenuItem>
                </a>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
