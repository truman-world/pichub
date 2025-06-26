<p align="center">
  <img src="[https://raw.githubusercontent.com/truman-world/pichub/main/public/logo.svg](https://raw.githubusercontent.com/truman-world/pichub/e2a689b8e1b25b8c5f838f52c62d42ad6decaa6d/pichub.app.png)" alt="PicHub Logo" width="120">
</p>

<h1 align="center">PicHub</h1>

<p align="center">
  <strong>🖼️ 为开发者、内容创作者和团队打造的现代化、可自托管、企业级的开源图床解决方案</strong>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="版本"></a>
  <a href="https://github.com/truman-world/pichub/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="开源协议"></a>
  <a href="https://github.com/truman-world/pichub/actions/workflows/deploy.yml"><img src="https://github.com/truman-world/pichub/actions/workflows/deploy.yml/badge.svg" alt="CI/CD Status"></a>
  <a href="https://github.com/truman-world/pichub/graphs/contributors"><img src="https://img.shields.io/github/contributors/truman-world/pichub" alt="贡献者"></a>
</p>

---

**PicHub** 不仅仅是一个图床。它是一个基于现代全栈技术、专为追求数据主权和极致性能的开发者与团队设计的**私有化图片资产管理中心**。它将强大的功能、优雅的设计与企业级的部署流程融为一体，让您对自己的数字资产拥有绝对的控制权。

## ✨ 核心优势：为什么选择 PicHub？

* 🚀 **企业级的技术架构 (Enterprise-Grade Architecture)**:
    * **前端**: 采用 **Next.js 14 (App Router)** 和 **React 18** 构建，利用服务端组件（RSC）和流式渲染（Streaming）等前沿技术，提供了极致的页面加载速度和卓越的用户体验。
    * **后端**: 基于 Next.js API Routes 和业界领先的 **Prisma ORM**，实现了高效的数据库交互和清晰的业务逻辑分层。
    * **语言**: **全栈 TypeScript** 提供了端到端的类型安全，极大地提高了代码的可维护性和健壮性，是大型项目和团队协作的基石。
    * **样式**: 采用 **Tailwind CSS** 和 **ShadCN/UI** 组件库，轻松实现美观、一致且高度可定制的界面。

* 🔐 **绝对的数据主权 (Complete Data Sovereignty)**:
    * **100% 自托管**: 您可以将 PicHub 部署在**任何您自己的服务器或私有云**上。所有图片、元数据和用户信息都完全在您的掌控之中，彻底摆脱第三方服务的数据泄露、审查或服务关停风险。

* ☁️ **高度可扩展的存储后端 (Highly Extensible Storage)**:
    * 采用面向接口的**策略模式（Strategy Pattern）** 进行设计，存储后端与主程序完全解耦。这使得添加新的存储方案变得异常简单，无论是**本地服务器磁盘**，还是**阿里云 OSS**、**腾讯云 COS**、**AWS S3**，乃至 **FTP/SFTP**，都可以作为存储引擎无缝集成。

* 🤖 **专业、可靠的自动化部署 (Professional CI/CD)**:
    * 项目内置了经过反复优化的 **GitHub Actions** 工作流。该工作流采用**构建与部署分离**的最佳实践：在 GitHub 高性能服务器上完成所有耗时的编译和依赖安装，然后将一个轻量级的、可直接运行的“成品”推送到您的服务器上。这极大地降低了对您服务器性能的要求，确保了部署过程的**高速和稳定**。

* 💡 **智能化的初始设置 (Intelligent Setup)**:
    * 内置优雅的**首次运行检测机制**。当应用检测到尚未初始化时，会自动引导第一个登录的用户进入设置页面，创建管理员账户，整个过程无需任何命令行操作，极大地简化了首次部署的复杂度。

* 👥 **完善的用户与权限体系 (Robust User & Permission System)**:
    * 提供完整的用户注册、登录和角色管理功能。**管理员**与**普通用户**的角色分离，为团队协作和权限控制提供了基础。

## 🎨 功能特性

-   [x] **公共上传主页**: 无需登录即可快速拖拽、粘贴或点击上传图片。
-   [x] **客户端图片处理**: 上传前可选择开启图片压缩，自定义压缩质量，有效节省存储空间和带宽。
-   [x] **多格式链接生成**: 上传成功后自动生成并展示 URL、HTML、BBCode 和 Markdown 四种常用链接格式，一键复制。
-   [x] **本地历史记录**: 在浏览器本地保存游客的上传历史，方便追溯。
-   [x] **智能初始化**: 首次部署自动引导创建管理员账户。
-   [x] **用户系统**: 支持用户注册、登录、角色管理（管理员/普通用户）。
-   [x] **仪表盘**: 为登录用户提供独立的上传和管理空间。
-   [x] **响应式设计**: 完美适配桌面、平板和手机等各种尺寸的设备。
-   [x] **主题切换**: 内置优雅的浅色与深色模式，并能跟随系统设置。
-   [ ] **相册管理 (规划中)**: 登录用户可创建、编辑、删除相册，对图片进行分类管理。
-   [ ] **更丰富的图片处理 (规划中)**: 添加水印、图片裁剪、尺寸调整等。
-   [ ] **更丰富的存储后端支持 (规划中)**:
    -   [x] 本地服务器存储
    -   [ ] 阿里云 OSS
    -   [ ] 腾讯云 COS
    -   [ ] 兼容 S3 的对象存储 (如 MinIO)
    -   [ ] FTP / SFTP / WebDAV

## 🚀 部署指南 (推荐)

本项目**强烈推荐**使用提供的 **GitHub Actions** 工作流进行自动化部署，这是最简单、最可靠的方式。

1.  **准备服务器**:
    * 一台已经安装好 **Node.js (>= 18.x)** 和 **PostgreSQL (>= 14)** 的服务器。
    * 建议使用 PM2 来管理 Node.js 进程。

2.  **在服务器上创建配置文件**:
    * 登录到您的服务器，进入您打算部署应用的目标目录（例如 `/www/wwwroot/pichub`）。
    * 在该目录下创建一个名为 `.env.local` 的文件，并填入以下内容：
        ```ini
        # 数据库连接字符串，?sslmode=disable 对于本地数据库连接非常重要
        DATABASE_URL='postgresql://USER:PASSWORD@localhost:5432/DATABASE?sslmode=disable'
        
        # 用于签发用户登录凭证的密钥，请务必修改为一个长而复杂的随机字符串
        JWT_SECRET='YOUR_SUPER_SECRET_RANDOM_STRING'
        
        # 您的应用的访问地址
        NEXTAUTH_URL='http://YOUR_SERVER_IP:3000'
        ```

3.  **配置 GitHub Secrets**:
    * Fork 本项目到您自己的 GitHub 账户。
    * 在您的新仓库中，进入 **Settings -> Secrets and variables -> Actions**。
    * 添加以下仓库机密 (Repository secrets)：
        * `SERVER_HOST`: 您服务器的 IP 地址。
        * `SERVER_USERNAME`: 您用于登录服务器的用户名（例如 `root`）。
        * `SSH_PRIVATE_KEY`: 用于免密登录您服务器的 SSH 私钥。

4.  **触发部署**:
    * 将代码推送到您仓库的 `main` 分支。
    * GitHub Actions 会自动接管一切：在云端完成编译打包，然后将一个可以直接运行的成品部署到您的服务器上，并用 PM2 重启应用。

部署完成后，即可开始使用。

## 本地开发

如果您希望在本地进行开发或贡献代码，请遵循以下步骤：

1.  **克隆项目**: `git clone https://github.com/truman-world/pichub.git`
2.  **进入目录**: `cd pichub`
3.  **安装依赖**: `npm install`
4.  **配置本地环境**: 复制 `.env.local.example` 为 `.env.local` 并填入您的本地数据库信息。
5.  **初始化数据库**: `npx prisma db push`
6.  **启动开发服**: `npm run dev`

## 🤝 参与贡献

我们张开双臂欢迎任何形式的贡献！无论是提交 Issue 来报告问题、修复一个 Bug、实现一个新功能还是仅仅是改进文档，都对这个项目非常有帮助。

## 📄 开源协议

本项目基于 [MIT License](https://github.com/truman-world/pichub/blob/main/LICENSE) 开源。
