// pages/admin/dashboard.tsx
import type { GetServerSidePropsContext } from 'next';
import { verifyAuth } from '@/lib/auth'; // 我们将创建这个辅助函数

interface AdminDashboardProps {
    user: {
        email: string;
        role: string;
    }
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
    return (
        <div style={{ padding: '20px' }}>
            <h1>管理员后台</h1>
            <p>欢迎, {user.email}!</p>
            <p>您的角色是: {user.role}</p>
            <p>在这里，您可以管理用户、存储设置和图片。</p>
            {/* 在这里构建您的管理功能 */}
        </div>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    // 在服务器端验证用户身份和角色
    const result = await verifyAuth(context.req);

    // 如果用户未登录或不是管理员，则重定向到登录页
    if (!result.user || result.user.role !== 'ADMIN') {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    // 如果验证通过，将用户信息传递给页面组件
    return {
        props: { user: result.user },
    };
}
