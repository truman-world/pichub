// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'pichub',
      script: 'node_modules/.bin/next',
      args: 'start',
      // --- 核心修复：让PM2为应用加载 .env 文件 ---
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
