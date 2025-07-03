/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- 核心修改：告诉Next.js应用的基础路径是 /pichub ---
  basePath: '/pichub',
  
  // 保持独立版输出，这是最佳实践
  output: 'standalone',
};

export default nextConfig;
