/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true, // 您可以根据需要开启或关闭严格模式

  // --- 核心修复：重写路由以正确提供上传的文件 ---
  // 这个配置告诉 Next.js，任何对 /uploads/* 的请求，
  // 实际上都应该去服务器的 /.next/static/media/ 目录下寻找文件。
  // 我们会在上传API中确保文件被移动到这个正确的、可公开访问的位置。
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/.next/static/media/:path*',
      },
    ]
  },
};

export default nextConfig;
