// components/Header.tsx
import Link from 'next/link';

interface User {
    id: string;
    username: string;
    email: string;
    role: 'ADMIN' | 'USER';
}

interface HeaderProps {
    user: User | null;
}

export default function Header({ user }: HeaderProps) {
    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b">
            <div className="max-w-4xl mx-auto flex justify-between items-center p-4">
                <Link href="/" className="text-xl font-bold text-slate-800">
                    PicHub
                </Link>
                <nav>
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-600">欢迎, {user.username}!</span>
                            {user.role === 'ADMIN' && (
                                <Link href="/admin/dashboard" className="text-sm font-medium text-sky-600 hover:text-sky-800">
                                  管理后台
                                </Link>
                            )}
                            {/* --- 核心修复：将 <a> 标签改为 <Link> 以支持 basePath --- */}
                            <Link href="/api/logout" className="text-sm font-medium text-slate-600 hover:text-slate-800">
                                退出登录
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md">
                                登录
                            </Link>
                            <Link href="/register" className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md">
                                注册
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
