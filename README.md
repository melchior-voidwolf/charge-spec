# Charge Spec - 充电头规格网站

一个展示各类充电头技术规格的网站，支持多品牌、多协议的充电器查询和对比。

## 技术栈

- **Web**: Next.js 15 + TypeScript + Tailwind CSS + React 19
- **Mobile**: React Native (后期规划)
- **包管理**: Yarn Workspaces (Monorepo)

## 项目结构

```
charge-spec/
├── packages/
│   ├── web/                    # Next.js Web 应用
│   │   ├── src/
│   │   ├── app/                # Next.js App Router
│   │   │   ├── chargers/      # 充电器列表和详情页
│   │   │   ├── brand/         # 品牌页面
│   │   │   ├── api/           # API 路由
│   │   │   │   └── chargers/  # 充电器数据 API
│   │   │   └── components/    # 共享组件
│   │   ├── public/             # 静态资源
│   │   └── package.json
│   ├── shared/                  # 共享类型和工具
│   │   ├── src/
│   │   │   ├── types.ts       # 类型定义
│   │   │   └── sample-data.ts # 示例数据
│   │   └── package.json
│   └── mobile/                  # React Native App (未来)
├── .gitignore
├── .prettierrc              # Prettier 配置
├── feature_list.json          # 功能清单
├── claude-progress.txt       # 开发进度
├── package.json              # 根 workspace 配置
└── README.md                # 本文件
```

## 开始开发

### 环境要求

- Node.js >= 18.0.0
- Yarn >= 4.0.0

### 安装依赖

```bash
yarn install
```

### 启动开发服务器

```bash
yarn dev
```

应用将在 http://localhost:3000 启动。

### 构建生产版本

```bash
yarn build
```

### 运行类型检查

```bash
yarn type-check
```

### 代码格式化

```bash
yarn format
```

### 代码检查

```bash
yarn lint
```

## 主要功能

### 已实现功能 (28/30)

#### 基础设施

- ✅ Yarn Workspaces monorepo 配置
- ✅ Next.js 15 开发服务器
- ✅ TypeScript 编译检查
- ✅ Tailwind CSS 样式系统
- ✅ ESLint 配置
- ✅ Prettier 代码格式化

#### 用户界面

- ✅ 响应式首页
- ✅ 导航头部组件
- ✅ 页脚组件
- ✅ 充电器列表页面
- ✅ 充电器详情页面
- ✅ 搜索功能
- ✅ 品牌筛选器
- ✅ 功率筛选器
- ✅ 协议筛选器
- ✅ 排序功能（功率、品牌）
- ✅ 品牌专页
- ✅ 404 Not Found 页面
- ✅ 深色模式（系统偏好）

#### 数据

- ✅ 完整的充电器类型定义
- ✅ 10个示例充电器数据
- ✅ 数据库集成计划（未来）

#### API

- ✅ GET /api/chargers - 获取所有充电器
- ✅ GET /api/chargers/[id] - 获取单个充电器详情
- ✅ 支持查询参数筛选

#### SEO

- ✅ 动态页面 metadata
- ✅ XML Sitemap 生成

### 充电器数据结构

```typescript
interface Charger {
  id: string
  brand: Brand
  model: string
  displayName: string
  power: {
    maxPower: number
    ports: PowerOutput[]
  }
  protocols: Protocol[]
  ports: PortConfiguration[]
  isGaN: boolean
  hasFoldingPlug: boolean
  dimensions?: {
    width: number
    height: number
    depth: number
  }
  weight?: number
  price?: {
    msrp: number
    current: number
  }
  // ... 更多字段见 packages/shared/src/types.ts
}
```

## API 文档

### 获取所有充电器

**端点**: `GET /api/chargers`

**查询参数**:

- `search` (string): 搜索关键词（品牌、功率、型号、协议）
- `brand` (string): 筛选品牌
- `minPower` (number): 最小功率
- `maxPower` (number): 最大功率
- `protocol` (string): 充电协议

**响应**:

```json
{
  "chargers": [...],
  "total": 10,
  "filters": {
    "search": "Apple",
    "brand": null,
    "minPower": null,
    "maxPower": null,
    "protocol": null
  }
}
```

### 获取单个充电器

**端点**: `GET /api/chargers/[id]`

**示例**: `/api/chargers/apple-a2653-30w`

**响应**: 单个充电器对象或 404

## 开发规范

### 代码风格

- 使用 TypeScript 编写所有代码
- 遵循 ESLint 和 Prettier 配置
- 组件使用函数式组件
- 使用 Tailwind CSS 工具类进行样式
- 保持组件小而专一

### Git 提交规范

```bash
# 功能开发
git commit -m "feat: 完成功能 XXX - 功能描述"

# Bug 修复
git commit -m "fix: 修复 XXX 问题的描述"

# 文档更新
git commit -m "docs: 更新 README"
```

### 分支策略

- `main`: 生产代码
- 功能分支: `feature/功能名称`
- 修复分支: `fix/问题名称`

## 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 代码审查标准

- 所有 TypeScript 错误必须修复
- ESLint 警告应尽可能解决
- 新功能需要相应的类型定义
- UI 更改需要考虑响应式设计
- API 更新需要考虑向后兼容性

## 部署

### 构建命令

```bash
# 构建
yarn build

# 启动生产服务器
yarn start
```

### 环境变量

（当前无必需环境变量，未来可能添加）

- `NEXT_PUBLIC_API_URL`: API 基础 URL
- `NEXT_PUBLIC_ANALYTICS_ID`: 分析跟踪 ID

## 路线图

### v1.0 (当前)

- 基础充电器展示
- 搜索和筛选功能
- 响应式设计
- API 端点

### v1.1 (计划)

- 用户收藏功能
- 对比多个充电器
- 图片上传和管理
- 数据库集成

### v2.0 (未来)

- 用户账户系统
- 评论和评分
- React Native 移动应用
- 实时价格跟踪

## 许可证

[待添加]

## 联系方式

- 项目主页: [待添加]
- 问题反馈: [待添加]
- 邮箱: [待添加]

---

**生成时间**: 2025-02-13
**版本**: 1.0.0
