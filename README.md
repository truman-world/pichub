<p align="center">
  <img src="./logo.png" alt="PicHub Logo" width="150"/>
</p>

<h1 align="center">PicHub - 新一代智能图床解决方案</h1>

<p align="center">
  <img alt="构建状态" src="https://img.shields.io/badge/build-passing-brightgreen">
  <img alt="技术栈" src="https://img.shields.io/badge/teck-Next.js%20%7C%20Prisma%20%7C%20PostgreSQL-blue">
  <img alt="许可证" src="https://img.shields.io/badge/license-MIT-green">
</p>

**PicHub** 不仅仅是一个简单的图床。它是一个基于现代化技术栈构建的、高度可扩展、安全可控的私有化图像存储与管理平台，专为追求数据所有权、高可定制性和自动化运维的开发者与团队设计。

---

## 核心特点 ✨

* **🚀 一键式安装向导**: 告别繁琐的命令行配置。首次部署，系统将自动引导您进入图形化安装界面，轻松完成管理员账户和基础设置。
* **🧩 灵活的存储策略**: 内置强大的存储管理器。默认支持本地服务器存储，并采用面向接口的适配器模式（Adapter Pattern），使您可以轻松扩展对接阿里云OSS、腾讯云COS、Amazon S3等任意云存储服务。
* **🔐 数据安全与所有权**: 完全私有化部署，您的所有图片和用户数据都掌握在自己手中。采用 `bcrypt` 对密码进行高强度哈希加密，并通过 `HttpOnly` Cookie 配合 `JWT` 保护用户会话，确保用户信息安全。
* **💻 现代化技术栈**: 使用 **Next.js**、**TypeScript** 和 **Prisma** 等业界前沿技术构建，为您带来极致的开发体验、强大的类型安全和高效的数据库交互。
* **⚙️ 自动化CI/CD流程**: 集成 **GitHub Actions**，实现真正的 `Push-to-Deploy`。您只需将代码推送到 `main` 分支，即可自动触发测试、构建、打包和服务器部署，极大提升开发效率。
* **🌐 高度可扩展**: 从存储适配器到API接口，项目在设计之初就充分考虑了未来的功能扩展，为您天马行空的想象力提供坚实的技术基础。

---

## 项目优势 🎯

与其他图床项目相比，PicHub 在以下方面拥有无可比拟的优势：

#### 1. 模块化与高扩展性 (Modularity & Extensibility)

我们的核心竞争力在于**存储适配器（Storage Adapter）设计模式**。我们没有将文件上传逻辑与任何特定的存储服务（如本地存储）耦合，而是定义了一个统一的 `StorageAdapter` 接口。

```typescript
// 所有存储驱动都必须遵守的统一规范
export interface StorageAdapter {
  upload(fileBuffer: Buffer, filename: string): Promise<string>;
  delete(filename: string): Promise<void>;
}
```
这意味着：
* **轻松扩展**: 想支持一个新的云存储商？只需创建一个新的类来实现这个接口，然后在 `StorageManager` 中注册它即可，无需改动任何核心业务代码。
* **自由切换**: 管理员可以在后台无缝切换存储策略，应用层代码完全无感，实现了业务与存储的彻底解耦。

#### 2. 自动化与开发者体验 (Automation & DX)

* **数据库迁移自动化**: 我们在部署脚本中集成了 `npx prisma db push`。这意味着您在本地对 `schema.prisma` 文件做的任何模型修改，在部署时都会被自动同步到生产环境的数据库，无需手动执行SQL。
* **全栈TypeScript**: 从前端组件到后端API，再到数据库模型，完整的类型安全链条不仅减少了运行时错误，还带来了无与伦比的IDE代码补全和重构体验。
* **Prisma ORM**: 提供了类型安全的数据库查询，让您像操作JavaScript对象一样操作数据库，同时有效防止了SQL注入等常见安全问题。

#### 3. 部署即服务 (Deployment-as-a-Service)

我们为您配置的 GitHub Actions 工作流，已经超越了简单的“构建与部署”，它是一个完整的自动化运维流程：
1.  **自动构建**: 在云端隔离环境中编译项目。
2.  **自动打包**: 仅打包必要文件（`.next`, `node_modules`, `prisma`等），减小部署包体积。
3.  **SSH安全部署**: 通过SSH密钥安全地将代码包传输到您的服务器。
4.  **无中断重启**: 在服务器上，脚本会自动解压、同步数据库、并使用PM2平滑地重启应用，确保服务高可用。

---

## 技术栈 🛠️

* **前端**: Next.js (React) / TypeScript
* **后端**: Next.js API Routes / TypeScript
* **数据库**: PostgreSQL / Prisma ORM
* **认证**: JWT (JSON Web Tokens) / Cookies
* **部署与运维**: GitHub Actions (CI/CD) / PM2 / Nginx (推荐)

---

## 快速开始 🏁

1.  **克隆项目**
    ```bash
    git clone [https://github.com/truman-world/pichub.git](https://github.com/truman-world/pichub.git)
    ```
2.  **安装依赖**
    ```bash
    cd pichub
    npm install
    ```
3.  **配置环境变量**
    复制 `.env.example` (如果存在) 为 `.env.local`，并填入您的数据库连接信息和密钥。
    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    JWT_SECRET="YOUR_RANDOM_SECRET_KEY"
    NEXTAUTH_URL="http://YOUR_DOMAIN_OR_IP:3000"
    ```
4.  **启动开发环境**
    ```bash
    npm run dev
    ```
    首次启动，请访问 `http://localhost:3000`，系统将自动引导您进入安装页面。

---

## 贡献指南 🤝

我们欢迎任何形式的贡献！无论是提交 issue、修复 Bug 还是开发新功能。请遵循标准的 Fork & Pull Request 流程。

## 许可证 📜

本项目采用 [MIT](https://opensource.org/licenses/MIT) 许可证。

