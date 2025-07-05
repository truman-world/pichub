/** @type {import('next').NextConfig} */
const nextConfig = {
  // 我们只需要这一个配置，告诉Next.js生成适合“动静分离”部署的输出。
  // 这一行是解决 ".next/standalone directory not found" 错误的唯一关键。
  output: 'standalone',
};

export default nextConfig;
