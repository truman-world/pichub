// pages/index.tsx
import type { GetServerSidePropsContext } from 'next';
import { verifyAuth } from '@/lib/auth';
import type { User, Image } from '@prisma/client';
import Header from '@/components/Header';
import Uploader from '@/components/Uploader';
import ImageHistory from '@/components/ImageHistory';
import prisma from '@/lib/prisma';

interface HomePageProps {
  user: {
      id: string;
      username: string;
      email: string;
      role: 'ADMIN' | 'USER';
  } | null;
  initialImages: Image[];
}

export default function HomePage({ user, initialImages }: HomePageProps) {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Header user={user} />
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <Uploader />
        <ImageHistory initialImages={initialImages} />
      </main>
      <footer className="text-center py-8 text-slate-500">
        <p>PicHub - 构建于 2025</p>
      </footer>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await verifyAuth(context.req);
  let user = null;
  let initialImages: Image[] = [];

  if (auth.user) {
    // 如果用户登录，获取完整的用户信息和他们的图片历史
    user = await prisma.user.findUnique({
      where: { id: auth.user.userId },
      select: { id: true, username: true, email: true, role: true }
    });

    if (user) {
      initialImages = await prisma.image.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10, // 初始加载10张
      });
    }
  }

  return {
    props: {
      user,
      initialImages: JSON.parse(JSON.stringify(initialImages)), // 序列化Date对象
    },
  };
}
