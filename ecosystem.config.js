// ecosystem.config.js
// 这是PM2的官方配置文件，是生产环境部署Node.js应用的最佳实践。
module.exports = {
  apps: [
    {
      name: 'pichub',
      // --- 核心修复1：明确指定工作目录 ---
      // 告诉PM2，总是在这个目录下执行命令，确保路径不会出错。
      cwd: '/www/wwwroot/8.148.7.13',
      script: 'server.js',
      args: '',
      env: {
        NODE_ENV: 'production',
        // --- 核心修复2：直接在这里定义端口 ---
        // 这是为PM2应用设置环境变量的正确方式。
        PORT: 3000,
      },
    },
  ],
};
