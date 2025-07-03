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
  // --- 核心修复：在这里进行安装检查 ---
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) {
    // 如果未安装，直接从服务器重定向到安装页
    return {
      redirect: {
        destination: '/install', // Next.js 会自动处理 basePath
        permanent: false,
      },
    };
  }
  // --- 检查结束 ---

  const auth = await verifyAuth(context.req);
  let user = null;
  let initialImages: Image[] = [];

  if (auth.user) {
    user = await prisma.user.findUnique({
      where: { id: auth.user.userId },
      select: { id: true, username: true, email: true, role: true }
    });

    if (user) {
      initialImages = await prisma.image.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
    }
  }

  return {
    props: {
      user,
      initialImages: JSON.parse(JSON.stringify(initialImages)),
    },
  };
}
