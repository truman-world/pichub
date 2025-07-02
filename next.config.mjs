/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- 核心修改：告诉Next.js输出一个独立的、包含所有依赖的文件夹 ---
  output: 'standalone',
};

export default nextConfig;
