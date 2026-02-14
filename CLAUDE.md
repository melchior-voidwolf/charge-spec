# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个充电头规格网站，使用 npm Workspaces 管理的 Monorepo 架构。

### 技术栈

- **Web**: Next.js 15 (App Router) + React 19 + Tailwind CSS
- **语言**: TypeScript (strict mode)
- **包管理**: npm Workspaces
- **数据库**: MongoDB Atlas (云数据库)
- **部署**: Vercel (自动部署)

### 项目结构

```
charge-spec/
├── packages/
│   ├── web/              # Next.js Web 应用
│   │   ├── src/
│   │   │   ├── app/         # Next.js App Router (关键目录)
│   │   │   │   ├── chargers/      # 充电器列表和详情页
│   │   │   │   ├── brand/         # 品牌专页
│   │   │   │   ├── api/           # API 路由
│   │   │   │   │   └── chargers/  # 充电器数据 API
│   │   │   │   ├── components/    # React 组件
│   │   │   │   └── layout.tsx     # 根布局
│   │   │   └── lib/           # 工具库
│   │   │       ├── mongodb.ts   # MongoDB 连接
│   │   │       └── db.ts        # 数据库操作
│   │   ├── scripts/        # 数据迁移脚本
│   │   ├── public/          # 静态资源
│   │   ├── next.config.ts  # Next.js 配置
│   │   └── tailwind.config.ts
│   └── shared/            # 共享类型和数据
│       └── src/
│           ├── types.ts       # 核心类型定义 (Charger, Protocol, Brand 等)
│           └── sample-data.ts # 示例充电器数据
├── feature_list.json     # 功能清单和进度追踪
└── package.json         # Monorepo workspace 配置
```

## 常用命令

### 开发相关

```bash
# 启动开发服务器 (http://localhost:3000)
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 代码质量

```bash
# TypeScript 类型检查
npm run type-check

# ESLint 检查
npm run lint

# Prettier 格式化
npm run format
```

### 依赖管理

```bash
# 安装所有依赖
npm install

# 为 web 包添加依赖
cd packages/web && npm install <package>

# 为 shared 包添加依赖
cd packages/shared && npm install -D <package>
```

### 数据库操作

```bash
# 运行数据迁移脚本（导入充电器数据到 MongoDB）
cd packages/web && npm run migrate:db
```

## 架构要点

### 数据库架构

- **MongoDB Atlas** 作为云数据库存储充电器数据
- **连接字符串** 通过环境变量 `MONGODB_URI` 配置
- **本地开发** 需要在 `packages/web/.env.local` 配置 MongoDB 连接
- **数据迁移** 使用 `scripts/migrate-to-db.ts` 导入数据
- **索引优化** 在数据迁移时自动创建（brand、power.maxPower、protocols）

### Monorepo 配置

- 根 `package.json` 配置了 `workspaces: ["packages/*"]`
- web 包通过 `@charge-spec/shared` 导入共享代码
- Next.js 配置了 `transpilePackages: ['@charge-spec/shared']` 以优化导入
- **已迁移到 npm**，不再使用 Yarn

### 模块解析重要细节

**shared 包**使用 `moduleResolution: "NodeNext"`：

- 相对导入**必须**包含 `.js` 扩展名
- 正确: `import { X } from './types.js'`
- 错误: `import { X } from './types'`
- 这是因为 NodeNext 模块解析需要显式的文件扩展名

**web 包**使用 `moduleResolution: "bundler"`：

- 不需要在相对导入中添加扩展名
- 使用路径别名 `@/` 指向 `./src/`

### 路由结构 (App Router)

- `/` - 首页
- `/chargers` - 充电器列表页（支持搜索和筛选）
- `/chargers/[id]` - 充电器详情页
- `/brand/[brand]` - 品牌专页
- `/api/chargers` - 获取所有充电器数据（支持查询参数）
- `/api/chargers/[id]` - 获取单个充电器详情
- `/sitemap.xml` - SEO 站点地图
- `/not-found` - 自定义 404 页面

### 数据类型

核心类型定义在 `packages/shared/src/types.ts`：

- `Charger` - 充电器完整数据结构
- `Brand` - 品牌枚举（Apple, Anker, Xiaomi 等）
- `Protocol` - 充电协议（PD, QC, AFC, SCP 等）
- `ConnectorType` - 接口类型（USB-C, USB-A, Lightning 等）
- `PowerRating` - 功率配置
- `ConnectorPort` - 端口配置
- `ChargerFilter` - 筛选器参数类型
- `SortOption` - 排序选项枚举

### API 端点行为

`GET /api/chargers` 支持的查询参数：

- `search` - 搜索关键词（品牌、功率、型号）
- `brand` - 按品牌筛选
- `minPower` / `maxPower` - 功率范围筛选
- `protocol` - 按协议筛选

返回格式：

```json
{
  "chargers": [...],
  "total": 10,
  "filters": { "search": "...", "brand": "...", ... }
}
```

### 性能优化策略

**列表页查询优化** (`getAllChargersForList()`):
- 只投影列表页需要的字段（不获取详细规格）
- 减少数据传输量约 60-70%
- 投影字段：id, brand, model, displayName, power.maxPower, protocols, ports.count, ports.type, isGaN

**MongoDB 索引**:
- 单字段索引：brand, power.maxPower, protocols
- 复合索引：brand + power.maxPower（常见筛选组合）
- 索引在数据迁移时自动创建

### 组件约定

- 使用函数式组件
- 优先使用 Tailwind 工具类而非内联样式
- 保持组件小而专一
- 导出的组件使用 `.tsx` 扩展名

### Git 提交规范

```bash
# 功能开发
git commit -m "feat: 完成功能 XXX - 功能描述"

# Bug 修复
git commit -m "fix: 修复 XXX 问题的描述"

# 文档更新
git commit -m "docs: 更新 README"
```

### 开发流程

1. 在 `feature_list.json` 中找到要开发的功能
2. 创建分支或直接在 main 开发
3. 编写代码（遵循 TypeScript 和 ESLint 规范）
4. 运行 `npm run type-check` 确保无类型错误
5. 运行 `npm run lint` 确保无代码风格问题
6. 测试功能是否正常工作
7. 更新 `feature_list.json` 中对应功能的 `passes` 为 `true`
8. 提交代码（自动触发 Vercel 部署）

### 本地开发环境配置

首次本地开发需要配置 MongoDB：

1. 创建 `packages/web/.env.local` 文件
2. 添加 MongoDB 连接字符串：
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/charge-spec?retryWrites=true&w=majority
   ```
3. 运行数据迁移：`cd packages/web && npm run migrate:db`
4. 启动开发服务器：`npm run dev`

### Vercel 部署配置

- 推送到 `main` 分支自动触发部署
- 在 Vercel 项目设置中配置 `MONGODB_URI` 环境变量
- 部署 URL：https://charge-spec.vercel.app（或自定义域名）

## 重要注意事项

### 环境变量配置

本地开发和 Vercel 部署都需要以下环境变量：

**必须**：
- `MONGODB_URI` - MongoDB Atlas 连接字符串

**获取 MongoDB 连接字符串**：
1. 注册 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 创建免费集群（512MB 存储）
3. 在 Database Access 创建数据库用户
4. 在 Network Access 添加 IP 地址（本地开发可用 `0.0.0.0/0`）
5. 点击 "Connect" → "Drivers" 获取连接字符串

### shared 包导入规则

当在 `packages/shared/src/` 中编写代码时：

- 导入同目录文件必须使用 `.js` 扩展名
- `from './types.js'` ✅
- `from './types'` ❌ (会报错 TS2835)

### Next.js 特性

- 使用 App Router（非 Pages Router）
- 服务端组件默认为 async
- 使用 `next/image` 优化图片
- 使用 `next/link` 进行内部链接

### 样式系统

- Tailwind CSS 已配置并可用
- 支持深色模式（通过系统偏好检测）
- 响应式设计（mobile first）

### 文件位置参考

- 充电器类型定义：`packages/shared/src/types.ts`
- 示例数据：`packages/shared/src/sample-data.ts`
- MongoDB 连接：`packages/web/src/lib/mongodb.ts`
- 数据库操作：`packages/web/src/lib/db.ts`
- 数据迁移脚本：`packages/web/scripts/migrate-to-db.ts`
- 主页：`packages/web/src/app/page.tsx`
- 充电器列表：`packages/web/src/app/chargers/page.tsx`
- 充电器详情：`packages/web/src/app/chargers/[id]/page.tsx`
- API 路由：`packages/web/src/app/api/chargers/route.ts`

## Claude 回复语言配置

**重要：所有回复必须使用中文（简体中文）**。这是项目要求，无论用户输入语言为何，Claude 都应以中文进行回复。

---

## 首次部署指南

### 1. MongoDB Atlas 设置

```bash
# 1. 注册并创建 MongoDB Atlas 集群
# 访问 https://www.mongodb.com/cloud/atlas

# 2. 创建数据库用户
# Database Access → Add New Database User

# 3. 配置网络访问
# Network Access → Add IP Address → 0.0.0.0/0（允许所有IP，生产环境应限制）

# 4. 获取连接字符串
# Click "Connect" → "Connect your application" → 复制连接字符串
```

### 2. 本地数据迁移

```bash
# 1. 配置环境变量
cd packages/web
cat > .env.local << EOF
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/charge-spec?retryWrites=true&w=majority
EOF

# 2. 运行数据迁移（导入 124+ 款充电器数据）
npm run migrate:db

# 输出示例：
# 🚀 开始迁移充电器数据到 MongoDB...
# 🗑️  清空现有数据...
# ✅ 现有数据已清空
# 📦 导入 124 条充电器数据...
# ✅ 数据导入完成
# 🔍 验证数据...
# ✅ 共导入 124 条记录
# 📇 创建数据库索引...
# ✅ MongoDB 索引创建成功
# ✅ 迁移完成！
```

### 3. Vercel 部署

```bash
# 1. 连接 Git 仓库
# 访问 https://vercel.com/dashboard
# Import Project → 选择 GitHub 仓库 melchior-voidwolf/charge-spec

# 2. 配置环境变量
# 在 Vercel 项目设置中添加：
#    MONGODB_URI = (你的 MongoDB 连接字符串)

# 3. 自动部署
# 推送到 main 分支后，Vercel 自动构建和部署
# 部署完成后获得 URL：https://charge-spec.vercel.app
```

### 4. 验证部署

访问部署的网站并验证：
- 首页正常加载
- 充电器列表显示 124+ 款数据
- 搜索和筛选功能正常
- 充电器详情页正常显示
