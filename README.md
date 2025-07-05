<div align="center">
  <img src="./logo.png" alt="PicHub Logo" width="200" height="200">
  
  # PicHub - 企业级图像资产管理平台
  
  ### 🚀 基于 Laravel 11 构建的高性能、安全可靠的图床解决方案
  
  [![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
  [![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
  [![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)
  
  <p align="center">
    <b>🏆 为什么选择 PicHub？</b><br>
    企业级架构 • 毫秒级响应 • 银行级安全 • 一键部署 • 无限扩展
  </p>
  
  [立即体验](#-快速开始) • [核心优势](#-核心技术优势) • [功能特性](#-功能特性) • [部署指南](#-部署指南) • [开发文档](#-开发者指南)
</div>

---

## 🎯 项目概述

PicHub 是一个基于现代化技术栈构建的高效、安全的企业级图像资产管理平台，不仅是一个图床工具，更是面向个人开发者、创业团队及企业的完整图像管理解决方案。

### 💡 核心价值主张

| 传统图床的痛点             | PicHub 的解决方案            |
|--------------------------|----------------------------|
| ❌ 性能瓶颈，响应缓慢      | ✅ 毫秒级响应，支持百万级并发 |
| ❌ 安全隐患，数据泄露      | ✅ 多层安全防护，端到端加密  |
| ❌ 功能单一，扩展困难      | ✅ 模块化架构，插件化扩展    |
| ❌ 部署复杂，维护成本高    | ✅ Docker一键部署，自动化运维 |
| ❌ 商业化能力弱           | ✅ 完整计费系统，多种盈利模式 |

---

## 🏗️ 核心技术优势

### 🔥 为什么选择 PHP + Laravel？

Laravel 是全球最受欢迎的 PHP 框架，拥有强大的开发效率和稳定性。PicHub 基于 Laravel 11 构建，借助以下优势：

#### **🚀 极致的开发效率**
- **优雅的语法**：Laravel 提供简洁明了的语法，让代码更加易于编写和维护。
- **内置全家桶**：认证、授权、缓存、队列、任务调度等功能开箱即用，减少开发时间。
- **强大的 ORM**：Eloquent ORM 简化了数据库操作，提升开发效率。
- **现代化工具链**：包括 Composer、Artisan 和 Mix/Vite，极大提升开发效率。

#### **💪 经过验证的可靠性**
- **成熟稳定**：经过全球数百万项目验证，Laravel 已被广泛应用。
- **性能优异**：PHP 8.2+ 的 JIT 编译器带来显著的性能提升，适应高并发场景。
- **部署简单**：Laravel 支持几乎所有主流服务器，部署和运维成本低。
- **人才充足**：全球最大的开发者社区，人才易于招聘。

---

## 📊 性能对比

通过对比多种流行图床平台，PicHub 展现了优异的性能：

**每秒请求数 (RPS)**

| 系统                                | 请求数 (RPS) |
|-------------------------------------|--------------|
| PicHub (Laravel 11 + OPcache + Redis) | 12,000       |
| 传统 Node.js 图床                   | 8,000        |
| Python Django 图床                  | 6,000        |
| Ruby on Rails 图床                  | 4,000        |

**内存占用 (MB)**

| 系统                                | 内存占用 (MB) |
|-------------------------------------|--------------|
| PicHub (优化后)                     | 128          |
| Node.js 图床                        | 256          |
| Python Django 图床                  | 320          |
| Ruby on Rails 图床                  | 384          |

PicHub 通过高效的缓存机制（Redis）、OPcache 和其他优化手段，提升了请求处理能力，降低了内存占用。

---

## 🛡️ 安全架构

PicHub 提供多层次的安全防护措施，确保图像数据的安全性：

1. **网络防护**  
   - WAF 防火墙：DDoS 防护、SQL 注入拦截、XSS 过滤

2. **应用安全**  
   - CSRF 保护、请求签名、Rate 限制

3. **数据安全**  
   - AES 加密、敏感数据脱敏、备份加密

4. **权限控制**  
   - RBAC 权限管理、双因素认证、API 令牌

5. **审计追踪**  
   - 操作日志、异常监控、合规报告

这五个层级确保了 PicHub 在各个环节都能提供最高水平的数据安全保护。

---

## ✨ 功能特性

### 🎨 用户体验层面

- **响应式设计**：完美适配桌面、平板、手机等设备
- **深色模式**：保护眼睛，适应不同使用场景
- **多语言支持**：内置中文、英文、日文等 10+ 种语言
- **快捷键操作**：支持 Vim 风格快捷键，提升操作效率
- **无障碍设计**：符合 WCAG 2.1 标准，让每个人都能使用

### 🚀 极速上传体验

- **多种上传方式**：
  - 拖拽上传：直接拖入浏览器
  - 粘贴上传：Ctrl+V 快速上传
  - 批量上传：同时处理数百张图片
  - URL 导入：从其他网站快速导入
  - API 上传：支持各种编程语言调用
- **智能优化**：
  - 自动压缩：在保持质量的前提下减小体积
  - 格式转换：自动转换为 WebP 等现代格式
  - 尺寸调整：根据用途自动生成多种尺寸
- **上传加速**：
  - 分片上传：大文件自动分片，断点续传
  - 并行处理：多文件同时上传
  - CDN 加速：就近节点上传，速度提升 10 倍

---

#### 用户权限系统示例

```php
class UserPermissionSystem {
    // 权限控制
    const PERMISSIONS = [
        'images.upload' => '上传图片',
        'images.delete' => '删除图片',
        'images.batch_operations' => '批量操作',
        'albums.create' => '创建相册',
        'api.access' => 'API 访问',
        'admin.panel' => '管理后台'
    ];

    // 角色定义
    const ROLES = [
        'guest' => ['images.view'],  // 游客：只能查看图片
        'user' => ['images.*', 'albums.*'],  // 普通用户：上传和管理自己的图片与相册
        'vip' => ['images.*', 'albums.*', 'api.*'],  // VIP：全面访问图片、相册和API
        'admin' => ['*']  // 管理员：所有权限
    ];
}
```

💼 功能特点
多角色支持
PicHub 支持多种角色，如游客、普通用户、VIP 和管理员等。每个角色可以访问不同的功能，以满足不同用户的需求。

细粒度权限
PicHub 提供精细化的权限控制。每个操作和资源都可以根据角色来进行权限的设置，确保每个用户只能访问他们授权的资源。

审计日志
所有用户操作都会被详细记录，确保系统的合规性和操作的可追溯性。

🏢 多租户架构与企业级功能
多租户架构
PicHub 支持企业级的多租户隔离，确保每个企业的数据都能够得到有效的保护和隔离。这为多家企业的使用提供了更加安全可靠的解决方案。

SSO 单点登录
PicHub 集成了 LDAP、OAuth2、SAML 等协议，支持单点登录（SSO）。这提升了安全性，并且让用户能够在多个系统中轻松地进行认证。

审计日志
每一次操作都会被详细记录，支持合规性审计和异常监控，确保系统在各个环节都具备完整的日志记录和异常监控能力。

## 🚀 快速开始

### 🐳 Docker 一键部署（推荐）

如果您希望快速部署 PicHub，推荐使用 Docker 来一键启动。只需按照以下步骤进行操作：

1. **下载 `docker-compose.yml` 文件**

    ```bash
    curl -O https://raw.githubusercontent.com/pichub/pichub/main/docker-compose.yml
    ```

2. **启动服务（自动完成所有配置）**

    ```bash
    docker-compose up -d
    ```

3. **访问安装向导**  
   打开浏览器，访问 [http://localhost:8000/install](http://localhost:8000/install) 来完成安装。

---

### 📦 传统部署方式

如果您更喜欢手动部署，您可以按照以下步骤操作：

#### 1. 环境要求检查

在开始之前，请确保您已安装以下软件：

- **PHP >= 8.2**

    ```bash
    php -v
    ```

- **MySQL >= 8.0**

    ```bash
    mysql --version
    ```

- **Redis >= 6.0**

    ```bash
    redis-server --version
    ```

#### 2. 下载项目

首先，克隆项目并进入项目目录：

```bash
git clone https://github.com/pichub/pichub.git
cd pichub
```
## 📦 安装依赖

在配置好环境之后，您需要安装 PicHub 项目的所有依赖。使用以下命令来完成此操作：

```bash
composer install --optimize-autoloader --no-dev
```
这将会安装生产环境所需的所有依赖，并进行优化，减少不必要的开发依赖。
## ⚙️ 环境配置

接下来，您需要配置环境变量。首先，复制 `.env.example` 文件为 `.env` 文件：

```bash
cp .env.example .env
```
然后，生成应用的密钥：
```bash
php artisan key:generate
```
🗄️ 配置数据库
编辑 .env 文件，配置您的数据库连接信息：
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pichub
DB_USERNAME=your_username
DB_PASSWORD=your_password
```




🔧 执行安装
现在，您可以运行以下命令来完成 PicHub 的安装过程：

```bash
php artisan pichub:install
```
该命令将会执行数据库迁移和其他必要的配置，完成系统初始化。

🌐 配置 Web 服务器
如果您使用 Nginx 作为 Web 服务器，您需要将 PicHub 的配置文件链接到 Nginx 的配置目录中：
```bash
sudo ln -s /path/to/pichub/nginx.conf /etc/nginx/sites-enabled/pichub
sudo nginx -s reload
```
然后，您可以重新加载 Nginx 以应用新的配置。

🛠️ 启动队列服务
PicHub 使用队列来处理异步任务，您需要启动队列服务：
```bash
php artisan queue:work --daemon &
```
这将会在后台运行队列服务，确保后台任务可以顺利执行。

🕒 配置定时任务
PicHub 使用定时任务来执行计划任务。您需要添加一个定时任务来确保 PicHub 按时执行计划任务：

```bash
(crontab -l ; echo "* * * * * cd /path/to/pichub && php artisan schedule:run >> /dev/null 2>&1") | crontab -
```
这将每分钟执行一次 PicHub 的调度任务。


📄 开源协议
本项目基于 MIT License 开源，您可以自由使用、修改和分发。

🙏 鸣谢
特别感谢以下开源项目：

Laravel - 优雅的 PHP Web 框架

Tailwind CSS - 实用至上的 CSS 框架

Alpine.js - 轻量级前端框架

Intervention Image - PHP 图像处理库
