/** @type {import('next').NextConfig} */
const nextConfig = {
  // 我们只需要这一个配置，告诉Next.js生成适合“动静分离”部署的输出。
  // 不要添加 basePath。
  output: 'standalone',
};

export default nextConfig;
