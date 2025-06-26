/*
 * ==========================================
 * 新文件: components/user-nav.tsx
 * ==========================================
 * 这是一个全新的智能导航组件。它会根据用户的登录状态，
 * 自动显示“登录/注册”按钮，或用户的头像下拉菜单。
 */
import { getAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogoutButton } from './logout-button'; // 我们将创建一个客户端组件来处理登出

export async function UserNav() {
  const user = await getAuth();

  if (!user) {
    return (
      <nav className="flex gap-2 sm:gap-4">
        <Button asChild variant="ghost"><Link href="/login">登录</Link></Button>
        <Button asChild><Link href="/register">注册</Link></Button>
      </nav>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/8.x/micah/svg?seed=${user.username}`} alt={user.username} />
            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.username}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.role === 'ADMIN' && (
           <DropdownMenuItem asChild><Link href="/dashboard">管理后台</Link></DropdownMenuItem>
        )}
        <DropdownMenuItem asChild><Link href="/dashboard/gallery">我的图库</Link></DropdownMenuItem>
        <DropdownMenuSeparator />
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
