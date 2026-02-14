# Charge Spec - 快充查查网

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248)](https://www.mongodb.com/)

专业的充电器技术规格数据库，支持多品牌、多协议的充电器查询和对比。

## 项目简介

Charge Spec 是一个专注于充电头技术规格的查询平台，收录了 Apple、Anker、小米、华为、OPPO、vivo、三星、CUKTECH、HONOR 等主流品牌的充电器数据（当前收录 **124+** 款充电器）。支持按品牌、功率、充电协议等多维度筛选和搜索。

## 技术架构

### 核心技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| [Next.js](https://nextjs.org/) | 15.1.6 | React 框架，支持 App Router、SSR |
| [React](https://react.dev/) | 19.0.0 | UI 组件库 |
| [TypeScript](https://www.typescriptlang.org/) | 5.7.3 | 类型安全的 JavaScript |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4.17 | 原子化 CSS 框架 |
| [npm](https://www.npmjs.com/) | 10.0.0 | 包管理器，支持 Workspaces |
| [MongoDB](https://www.mongodb.com/) | Atlas | 云数据库（存储充电器数据）|

### 工程化工具

- **ESLint** - 代码检查 (Flat Config 格式)
- **Prettier** - 代码格式化
- **TypeScript** - 严格模式类型检查
- **PostCSS + Autoprefixer** - CSS 后处理

### 系统架构图

```mermaid
flowchart TB
    subgraph Client["客户端"]
        Browser["浏览器"]
    end

    subgraph Vercel["Vercel 平台"]
        NextJS["Next.js 应用<br/>SSR/SSG"]

        subgraph AppRouter["App Router"]
            Pages["页面组件<br/>page.tsx"]
            Layouts["布局组件<br/>layout.tsx"]
            API["API 路由<br/>route.ts"]
        end

        subgraph Components["组件层"]
            Header["Header"]
            Footer["Footer"]
        end
    end

    subgraph Database["数据层"]
        MongoDB["MongoDB Atlas<br/>云数据库"]
    end

    Browser <-->|HTTPS| NextJS
    Pages -->|使用| Layouts
    Pages -->|包含| Components
    API -->|查询| MongoDB
    API -->|返回 JSON| Browser
```

### Monorepo 依赖关系

```mermaid
flowchart LR
    subgraph Workspace["npm Workspace"]
        direction TB

        subgraph Root["根目录"]
            RootPkg["package.json<br/>工作区配置"]
        end

        subgraph Packages["packages/"]
            direction LR

            WebPkg["@charge-spec/web<br/>Next.js 应用"]
            SharedPkg["@charge-spec/shared<br/>共享代码"]
        end
    end

    WebPkg -->|依赖| SharedPkg
    RootPkg -->|管理| WebPkg
    RootPkg -->|管理| SharedPkg

    style WebPkg fill:#e1f5fe
    style SharedPkg fill:#f3e5f5
```

## 项目结构

```
charge-spec/
├── packages/
│   ├── web/                    # Next.js Web 应用
│   │   ├── src/
│   │   │   ├── app/           # App Router 路由
│   │   │   │   ├── page.tsx          # 首页
│   │   │   │   ├── layout.tsx        # 根布局
│   │   │   │   ├── not-found.tsx     # 404 页面
│   │   │   │   ├── sitemap.ts        # SEO 站点地图
│   │   │   │   ├── chargers/         # 充电器列表页
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── ChargersClient.tsx
│   │   │   │   │   └── [id]/         # 充电器详情页
│   │   │   │   │       ├── page.tsx
│   │   │   │   │       └── ChargerDetailContent.tsx
│   │   │   │   ├── brand/            # 品牌专页
│   │   │   │   │   └── [brand]/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── api/              # API 路由
│   │   │   │       └── chargers/
│   │   │   │           ├── route.ts
│   │   │   │           └── [id]/
│   │   │   │               └── route.ts
│   │   │   ├── components/    # React 组件
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Footer.tsx
│   │   │   └── lib/           # 工具库
│   │   │       ├── mongodb.ts   # MongoDB 连接
│   │   │       └── db.ts       # 数据库操作
│   │   ├── public/            # 静态资源
│   │   ├── next.config.ts     # Next.js 配置
│   │   ├── tailwind.config.ts # Tailwind 配置
│   │   └── tsconfig.json      # TypeScript 配置
│   │
│   └── shared/                 # 共享包
│       └── src/
│           ├── types.ts       # 核心类型定义
│           ├── sample-data.ts # 示例数据
│           └── index.ts       # 导出入口
│
├── .vscode/                    # VSCode 配置
│   ├── settings.json          # 编辑器设置（自动格式化）
│   └── extensions.json        # 推荐扩展
│
├── eslint.config.mjs          # ESLint 配置
├── prettier.config.js        # Prettier 配置
└── package.json              # Workspace 根配置
```

## 核心功能

### 已实现功能

- **充电器列表** - 支持分页、排序（功率/品牌）
- **多维度筛选** - 品牌、功率范围、充电协议
- **全文搜索** - 支持品牌、型号、功率关键词
- **品牌专页** - 按品牌查看所有充电器
- **详情页面** - 完整的规格参数展示
- **响应式设计** - 完美适配桌面、平板、手机
- **SEO 优化** - 动态 sitemap.xml、语义化 HTML
- **动态数据** - 从 MongoDB 实时查询充电器数据

### 支持的充电协议

| 协议类型 | 具体协议 |
|----------|----------|
| USB PD | PD 2.0/3.0/3.1, PPS |
| Qualcomm QC | QC 2.0/3.0/4.0/5 |
| 华为 | SCP, FCP |
| OPPO/vivo | VOOC, SuperVOOC, Flash Charge |
| 三星 | AFC |
| 其他 | Apple 2.4A, BC 1.2 |

### 数据模型

```typescript
interface Charger {
  id: string
  brand: Brand
  model: string
  displayName: string
  description?: string
  power: {
    maxPower: number
    configurations: PowerConfiguration[]
  }
  protocols: Protocol[]
  ports: ConnectorPort[]
  physicalSpecs?: PhysicalSpecs
  isGaN?: boolean
  hasFoldingPlug?: boolean
  price?: { msrp?: number; current?: number }
  purchaseUrls?: { official?: string; amazon?: string }
  features?: string[]
  certifications?: string[]
  releaseYear?: number
  manufacturedIn?: string
  notes?: string
  officialUrl?: string
}
```

### 页面渲染流程

```mermaid
sequenceDiagram
    participant User as 用户
    participant Browser as 浏览器
    participant NextJS as Next.js
    participant API as API 路由
    participant MongoDB as MongoDB

    User->>Browser: 访问 /chargers
    Browser->>NextJS: 请求页面

    alt 服务端渲染 (SSR)
        NextJS->>MongoDB: 查询充电器数据
        MongoDB-->>NextJS: 返回数据
        NextJS-->>Browser: 返回 HTML
    else 客户端筛选
        Browser->>API: 筛选/排序请求
        API->>MongoDB: 查询数据
        MongoDB-->>API: 返回结果
        API-->>Browser: 返回 JSON
        Browser->>Browser: React 更新 DOM
    end

    Browser-->>User: 显示页面
```

## 开发指南

### 环境要求

- Node.js >= 18.0.0
- npm >= 10.0.0
- MongoDB Atlas（本地开发需要连接字符串）

### 本地开发配置

1. **创建 `.env.local` 文件**

在 `packages/web/` 目录下创建 `.env.local` 文件：

```bash
# MongoDB 连接字符串（从 MongoDB Atlas 获取）
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/charge-spec?retryWrites=true&w=majority
```

2. **获取 MongoDB 连接字符串**

- 注册 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- 创建免费集群（512MB 存储）
- 在 Database Access 创建数据库用户
- 在 Network Access 添加 IP 地址（开发环境可用 `0.0.0.0/0`）
- 点击 "Connect" → "Drivers" 获取连接字符串

3. **安装依赖**

```bash
npm install
```

### 开发命令

```bash
# 启动开发服务器 (http://localhost:3000)
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 代码格式化
npm run format
```

### Monorepo 工作流

```bash
# 为 web 包添加依赖
cd packages/web && npm install <package>

# 为 shared 包添加依赖
cd packages/shared && npm install -D <package>

# 运行所有包的类型检查
npm run type-check
```

## API 接口

### 获取所有充电器

```
GET /api/chargers?search=&brand=&minPower=&maxPower=&protocol=
```

**查询参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| search | string | 搜索关键词（品牌、型号、功率） |
| brand | string | 品牌筛选 |
| minPower | number | 最小功率（W） |
| maxPower | number | 最大功率（W） |
| protocol | string | 充电协议筛选 |

**响应示例：**

```json
{
  "chargers": [
    {
      "id": "apple-30w-usb-c",
      "brand": "Apple",
      "model": "A2347",
      "displayName": "Apple 30W USB-C 电源适配器",
      "power": {
        "maxPower": 30,
        "configurations": [
          { "voltage": "5V", "current": "3A", "power": "15W" },
          { "voltage": "9V", "current": "3A", "power": "27W" },
          { "voltage": "20V", "current": "1.5A", "power": "30W" }
        ]
      },
      "protocols": ["USB PD 2.0"],
      "ports": [
        {
          "type": "USB-C",
          "count": 1,
          "maxPower": 30,
          "protocols": ["USB PD 2.0"],
          "color": "无色"
        }
      ],
      "isGaN": false,
      "releaseYear": 2022
    }
  ],
  "total": 124,
  "filters": {
    "search": null,
    "brand": null,
    "minPower": null,
    "maxPower": null,
    "protocol": null
  }
}
```

### 获取单个充电器

```
GET /api/chargers/[id]
```

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 充电器 ID（如 `apple-30w-usb-c`） |

**响应示例：**

```json
{
  "charger": {
    "id": "apple-30w-usb-c",
    "brand": "Apple",
    "model": "A2347",
    "displayName": "Apple 30W USB-C 电源适配器",
    "description": "适用于 iPad Air 和 iPhone 机型，支持快速充电。",
    ...
  }
}
```

## 部署

### 部署架构

```mermaid
flowchart LR
    subgraph Dev["开发环境"]
        DevCode["源代码<br/>TypeScript/React"]
    end

    subgraph GitHub["GitHub"]
        MainBranch["main 分支"]
    end

    subgraph Vercel["Vercel 平台"]
        NextJS["Next.js 应用<br/>SSR/SSG"]
    end

    subgraph MongoDBAtlas["MongoDB Atlas"]
        Database["充电器数据库<br/>124+ 款充电器"]
    end

    DevCode -->|push| MainBranch
    MainBranch -->|自动部署| NextJS
    NextJS -->|查询| Database
    NextJS -->|访问| Users["用户浏览器"]

    style Vercel fill:#e1f5fe
    style Database fill:#47A248
```

### 部署到 Vercel

本项目使用 **Vercel** 平台部署：

1. **连接 Git 仓库**

   - 登录 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "Add New Project"
   - 导入 GitHub 仓库 `melchior-voidwolf/charge-spec`

2. **配置环境变量**

   在 Vercel 项目设置中添加以下环境变量：

   ```bash
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/charge-spec?retryWrites=true&w=majority
   ```

3. **自动部署**

   - 每次推送到 `main` 分支，Vercel 自动触发部署
   - 部署完成后获得预览 URL（如 `charge-spec.vercel.app`）

4. **自定义域名**（可选）

   - 在 Vercel 项目设置中添加自定义域名
   - 配置 DNS 记录指向 Vercel

### 数据迁移

首次部署时需要导入充电器数据到 MongoDB：

```bash
# 运行数据迁移脚本
cd packages/web
npm run migrate:db
```

该脚本会将 `packages/shared/src/crawled-chargers.ts` 中的 124+ 款充电器数据批量导入到 MongoDB。

## 代码规范

- **TypeScript**: 严格模式，所有代码必须类型安全
- **ESLint**: 使用 Flat Config 格式，集成 React Hooks 规则
- **Prettier**: 统一代码风格，保存时自动格式化
- **Git 提交**: 使用语义化提交信息（feat/fix/docs/style）

## 浏览器支持

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Chrome for Android 90+

## 许可证

MIT

---

**项目链接**: [https://github.com/melchior-voidwolf/charge-spec](https://github.com/melchior-voidwolf/charge-spec)
