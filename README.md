<p align="center">
  <img src="https://raw.githubusercontent.com/truman-world/pichub/main/public/logo.svg" alt="PicHub Logo" width="120">
</p>

<h1 align="center">PicHub</h1>

<p align="center">
  <strong>🖼️ 为开发者、内容创作者和团队打造的现代化、可自托管的开源图床解决方案</strong>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="版本"></a>
  <a href="#"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="开源协议"></a>
  <a href="https://github.com/truman-world/pichub/graphs/contributors"><img src="https://img.shields.io/github/contributors/truman-world/pichub" alt="贡献者"></a>
  <a href="#"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="欢迎 PR"></a>
</p>

---

**PicHub** 是一个功能强大、易于部署且高度可扩展的图床系统。它不仅提供了优雅的用户界面，还拥有强大的后端支持，旨在为您提供对自己图片数据的完全掌控权。无论您是需要为博客寻找一个可靠的图片托管服务，还是希望为团队搭建一个私有的图片素材库，PicHub 都是您的理想选择。

## 核心优势

* 🚀 **现代化技术栈**:
    * **前端**: 采用 **Next.js 14 (App Router)** 和 **React 18** 构建，提供极致的性能和优秀的用户体验。
    * **后端**: 基于 Next.js API Routes 和 **Prisma ORM**，开发效率高，维护简单。
    * **语言**: 全栈使用 **TypeScript**，保证了代码的健壮性和类型安全。
    * **样式**: 使用 **Tailwind CSS**，轻松实现美观且高度可定制的界面。

* 🔐 **完全自托管，数据可控**:
    * 您可以将 PicHub 部署在**任何您自己的服务器**上，所有图片和元数据都由您自己掌控，无需担心第三方服务的数据泄露或服务关停风险。

* ☁️ **高度可扩展的存储后端**:
    * 采用策略模式设计，支持多种存储方案。您可以轻松地从**本地存储**切换到**阿里云 OSS**、**腾讯云 COS**、**AWS S3** 或其他任何兼容 S3 协议的对象存储服务。

* 🤖 **一键式自动化部署**:
    * 项目内置了完善的 **GitHub Actions** 工作流。您只需要将代码推送到 GitHub，即可实现**自动编译、部署和重启**，极大地简化了运维流程。

* 👥 **完善的用户与权限系统**:
    * 内置完整的用户注册、登录和管理功能。支持管理员(Admin)和普通用户(User)两种角色，为后续的权限管理打下坚实基础。

* 🔓 **开源免费**:
    * 项目基于 **MIT 开源协议**，您可以自由地使用、修改和分发，无需任何费用。

## 功能特性

- [x] **用户系统**: 支持用户注册、登录、角色管理。
- [x] **拖拽上传**: 直观、便捷的拖拽上传和多文件上传功能。
- [x] **图片处理**: 在客户端进行图片压缩，节省存储空间和带宽。
- [x] **相册管理**: 支持创建、编辑、删除相册，方便地对图片进行分类管理。
- [x] **链接复制**: 一键复制多种格式的图片链接（URL, Markdown, HTML）。
- [x] **图片预览**: 点击图片可进行大图预览，查看详细信息。
- [x] **响应式设计**:完美适配桌面、平板和手机设备。
- [x] **主题切换**: 支持浅色模式和深色模式。
- [ ] **多存储后端支持 (已规划)**:
    - [x] 本地存储
    - [ ] 阿里云 OSS
    - [ ] 腾讯云 COS
    - [ ] 兼容 S3 的对象存储 (如 MinIO)
    - [ ] FTP / SFTP
    - [ ] WebDAV

## 快速开始

### 环境要求
* Node.js 18.x 或更高版本
* PostgreSQL 14 或更高版本

### 安装步骤

1.  **克隆项目到本地**
    ```bash
    git clone [https://github.com/truman-world/pichub.git](https://github.com/truman-world/pichub.git)
    cd pichub
    ```

2.  **安装项目依赖**
    ```bash
    npm install
    ```

3.  **配置环境变量**
    * 复制环境变量示例文件：
        ```bash
        cp .env.local.example .env.local
        ```
    * 编辑 `.env.local` 文件，填入您的数据库连接信息和 JWT 密钥。

4.  **初始化数据库**
    * 运行以下命令，让 Prisma 根据 `prisma/schema.prisma` 文件在您的数据库中创建表结构：
        ```bash
        npx prisma db push
        ```

5.  **启动开发服务器**
    ```bash
    npm run dev
    ```

现在，打开浏览器访问 `http://localhost:3000`，即可看到您的 PicHub 应用！

## 部署指南

本项目推荐使用提供的 **GitHub Actions** 工作流进行自动化部署。

1.  在您的服务器上准备好 Node.js 和 PostgreSQL 环境。
2.  在 GitHub 仓库的 **Settings -> Secrets and variables -> Actions** 中，添加工作流所需的机密信息（如服务器 IP、登录名、SSH 私钥、数据库 URL 等）。
3.  将代码推送到 `main` 分支。
4.  GitHub Actions 会自动完成编译、部署和重启应用的全部流程。

详细的部署步骤和 `deploy.yml` 文件已包含在项目中。

## 参与贡献

我们欢迎任何形式的贡献！无论是提交 Issue、修复 Bug、添加新功能还是完善文档，都对我们非常有帮助。

请在提交 Pull Request 前阅读我们的贡献指南（待补充）。

## 开源协议

本项目基于 [MIT License](https://github.com/truman-world/pichub/blob/main/LICENSE) 开源。
