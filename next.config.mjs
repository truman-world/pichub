/** @type {import('next').NextConfig} */
const nextConfig = {
  // 这一行是解决 ".next/standalone directory not found" 错误的唯一关键
  output: 'standalone',
};

export default nextConfig;
