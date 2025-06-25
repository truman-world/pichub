// hooks/use-auth.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// 定义我们自己的用户类型，现在包含了 role
interface AppUser {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN'; // 添加角色属性
}

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      // TODO: 验证用户登录状态
      setLoading(false);
    };

    checkUser();
  }, []);

  const signOut = async () => {
    // TODO: 添加登出逻辑
    setUser(null);
    router.push('/login');
  };

  // 暂时返回模拟数据，现在也包含 role
  return {
    user: user || { id: 'temp-id', email: 'test@example.com', username: 'Test User', role: 'USER' },
    loading,
    signOut,
  };
}
