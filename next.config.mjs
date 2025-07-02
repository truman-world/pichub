/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- 核心修改：告诉Next.js输出一个独立的、包含所有依赖的文件夹 ---
  // 这一行是解决 "cannot stat '.next/standalone'" 错误的关键
  output: 'standalone',
};

export default nextConfig;
