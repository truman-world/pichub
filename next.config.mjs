/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,

  // 这个配置是解决图片404问题的关键。
  // 它告诉 Next.js，任何对 /uploads/* 路径的请求，
  // 实际上都应该去服务器的一个稳定、可公开访问的目录去寻找文件。
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
