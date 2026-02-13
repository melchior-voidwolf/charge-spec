# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个充电头规格网站，使用 Yarn Workspaces 管理的 Monorepo 架构。

### 技术栈
- **Web**: Next.js 15 (App Router) + React 19 + Tailwind CSS
- **语言**: TypeScript (strict mode)
- **包管理**: Yarn Workspaces + Plug'n'Play
- **测试**: Playwright (E2E)

### 项目结构

```
charge-spec/
├── packages/
│   ├── web/              # Next.js Web 应用
│   │   ├── app/         # Next.js App Router (关键目录)
│   │   │   ├── chargers/      # 充电器列表和详情页
│   │   │   ├── brand/         # 品牌专页
│   │   │   ├── api/           # API 路由
│   │   │   │   └── chargers/  # 充电器数据 API
│   │   │   ├── components/    # React 组件
│   │   │   └── layout.tsx     # 根布局
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
yarn dev

# 构建生产版本
yarn build

# 启动生产服务器
yarn start
```

### 代码质量
```bash
# TypeScript 类型检查
yarn type-check

# 单独检查 shared 包
cd packages/shared && yarn type-check

# 单独检查 web 包
cd packages/web && yarn type-check

# ESLint 检查
yarn lint

# Prettier 格式化
yarn format
```

### 测试
```bash
# 运行 E2E 测试
yarn test

# 运行有界面的测试
yarn test:headed
```

### 依赖管理
```bash
# 安装所有依赖
yarn install

# 为 web 包添加依赖
cd packages/web && yarn add <package>

# 为 shared 包添加依赖
cd packages/shared && yarn add -D <package>
```

## 架构要点

### Monorepo 配置
- 根 `package.json` 配置了 `workspaces: ["packages/*"]`
- web 包通过 `@charge-spec/shared` 导入共享代码
- Next.js 配置了 `transpilePackages: ['@charge-spec/shared']` 以优化导入

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
4. 运行 `yarn type-check` 确保无类型错误
5. 运行 `yarn lint` 确保无代码风格问题
6. 测试功能是否正常工作
7. 更新 `feature_list.json` 中对应功能的 `passes` 为 `true`
8. 提交代码

## 重要注意事项

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
- 主页：`packages/web/src/app/page.tsx`
- 充电器列表：`packages/web/src/app/chargers/page.tsx`
- 充电器详情：`packages/web/src/app/chargers/[id]/page.tsx`
- API 路由：`packages/web/src/app/api/chargers/route.ts`
