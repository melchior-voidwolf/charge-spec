# Charge Spec - 快充查查网

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)](https://tailwindcss.com/)

**在线访问**: [https://melchior-voidwolf.github.io/charge-spec/](https://melchior-voidwolf.github.io/charge-spec/)

专业的充电器技术规格数据库，支持多品牌、多协议的充电器查询和对比。

## 项目简介

Charge Spec 是一个专注于充电头技术规格的查询平台，收录了 Apple、Anker、小米、华为、OPPO、vivo、三星、CUKTECH、HONOR 等主流品牌的充电器数据。支持按品牌、功率、充电协议等多维度筛选和搜索。

## 技术架构

### 核心技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| [Next.js](https://nextjs.org/) | 15.1.6 | React 框架，支持 App Router、SSG/SSR |
| [React](https://react.dev/) | 19.0.0 | UI 组件库 |
| [TypeScript](https://www.typescriptlang.org/) | 5.7.3 | 类型安全的 JavaScript |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4.17 | 原子化 CSS 框架 |
| [Yarn](https://yarnpkg.com/) | 4.5.3 | 包管理器，支持 Workspaces |

### 工程化工具

- **ESLint** - 代码检查 (Flat Config 格式)
- **Prettier** - 代码格式化
- **TypeScript** - 严格模式类型检查
- **PostCSS + Autoprefixer** - CSS 后处理

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
│   │   │   │   │   └── [id]/         # 充电器详情页
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── brand/            # 品牌专页
│   │   │   │   │   └── [brand]/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── api/              # API 路由
│   │   │   │       └── chargers/
│   │   │   │           ├── route.ts
│   │   │   │           └── [id]/
│   │   │   │               └── route.ts
│   │   │   └── components/    # React 组件
│   │   │       ├── Header.tsx
│   │   │       └── Footer.tsx
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
├── prettier.config.js         # Prettier 配置
├── fix-basepath.js            # 静态导出路径修复脚本
└── package.json               # Workspace 根配置
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
  // ... 更多字段
}
```

## 开发指南

### 环境要求

- Node.js >= 18.0.0
- Yarn >= 4.0.0

### 安装依赖

```bash
yarn install
```

### 开发命令

```bash
# 启动开发服务器 (http://localhost:3000)
yarn dev

# 构建生产版本
yarn build

# 构建并修复静态导出路径（用于 GitHub Pages）
yarn build:fix

# 类型检查
yarn type-check

# 代码检查
yarn lint

# 代码格式化
yarn format
```

### Monorepo 工作流

```bash
# 为 web 包添加依赖
cd packages/web && yarn add <package>

# 为 shared 包添加依赖
cd packages/shared && yarn add -D <package>

# 运行所有包的类型检查
yarn workspaces foreach -Ap run type-check
```

## API 接口

### 获取所有充电器

```
GET /api/chargers?search=&brand=&minPower=&maxPower=&protocol=
```

**响应示例：**

```json
{
  "chargers": [...],
  "total": 10,
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

## 部署

本项目使用 **GitHub Pages** 部署：

1. 代码推送到 `main` 分支
2. GitHub Actions 自动执行构建流程
3. 静态文件部署到 `gh-pages` 分支
4. 通过 https://melchior-voidwolf.github.io/charge-spec/ 访问

### 本地构建预览

```bash
yarn build:fix
# 输出目录: packages/web/out
```

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

**在线演示**: [https://melchior-voidwolf.github.io/charge-spec/](https://melchior-voidwolf.github.io/charge-spec/)
