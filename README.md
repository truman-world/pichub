# 1. 环境要求检查
php -v  # 需要 PHP >= 8.2
mysql --version  # 需要 MySQL >= 8.0
redis-server --version  # 需要 Redis >= 6.0

# 2. 下载项目
git clone https://github.com/pichub/pichub.git
cd pichub

# 3. 安装依赖
composer install --optimize-autoloader --no-dev

# 4. 环境配置
cp .env.example .env
php artisan key:generate

# 5. 配置数据库（编辑 .env 文件）
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pichub
DB_USERNAME=your_username
DB_PASSWORD=your_password

# 6. 执行安装
php artisan pichub:install

# 7. 配置 Web 服务器（Nginx 示例）
sudo ln -s /path/to/pichub/nginx.conf /etc/nginx/sites-enabled/pichub
sudo nginx -s reload

# 8. 启动队列服务
php artisan queue:work --daemon &

# 9. 配置定时任务
(crontab -l ; echo "* * * * * cd /path/to/pichub && php artisan schedule:run >> /dev/null 2>&1") | crontab -
</details>
🤝 参与贡献
我们欢迎所有形式的贡献！无论是报告 Bug、提出新功能、改进文档还是提交代码。

如何贡献：

Fork 本仓库

创建功能分支 (git checkout -b feature/AmazingFeature)

提交更改 (git commit -m 'Add some AmazingFeature')

推送到分支 (git push origin feature/AmazingFeature)

创建 Pull Request

📄 开源协议
本项目基于 MIT License 开源，您可以自由使用、修改和分发。

🙏 鸣谢
核心贡献者：

<table> <tr> <td align="center"> <img src="https://via.placeholder.com/100" width="100px;" alt=""/> <br /><sub><b>张三</b></sub> <br />核心开发者 </td> <td align="center"> <img src="https://via.placeholder.com/100" width="100px;" alt=""/> <br /><sub><b>李四</b></sub> <br />UI/UX 设计师 </td> <td align="center"> <img src="https://via.placeholder.com/100" width="100px;" alt=""/> <br /><sub><b>王五</b></sub> <br />文档维护者 </td> </tr> </table>
特别感谢：

Laravel - 优雅的 PHP Web 框架

Tailwind CSS - 实用至上的 CSS 框架

Alpine.js - 轻量级前端框架

Intervention Image - PHP 图像处理库

赞助商：

<table> <tr> <td align="center"> <img src="https://via.placeholder.com/200x80" alt="赞助商1"/> </td> <td align="center"> <img src="https://via.placeholder.com/200x80" alt="赞助商2"/> </td> <td align="center"> <img src="https://via.placeholder.com/200x80" alt="赞助商3"/> </td> </tr> </table>
💬 联系我们

📧 邮箱：contact@pichub.com

💬 QQ 群：123456789

📱 微信公众号：PicHub官方

🐦 Twitter：@PicHubOfficial

📺 B站：PicHub官方账号

<div align="center"> <p> <b>🌟 如果 PicHub 对您有帮助，请给我们一个 Star！🌟</b> </p> <p> <i>Made with ❤️ by PicHub Team</i> </p> <p> <sub>Copyright © 2024 PicHub. All rights reserved.</sub> </p> </div> ```
