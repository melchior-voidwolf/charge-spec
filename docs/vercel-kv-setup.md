# Vercel KV 部署指南

## 📋 概述

本项目使用 **Vercel KV** 存储充电器数据。Vercel KV 是基于 Redis 的键值存储，免费额度如下：

- **256 MB 存储**
- **每天 10,000 次命令**

## 🚀 快速开始

### 1. 创建 Vercel KV 数据库

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入你的项目
3. 点击 **Storage** 标签
4. 点击 **Create Database**
5. 选择 **KV (Redis)** 并点击 **Continue**
6. 选择区域（推荐选离你最近的）
7. 点击 **Create**

### 2. 自动环境变量

创建数据库后，Vercel 会自动为你的项目添加以下环境变量：

- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

**无需手动配置！**

### 3. 导入数据

在 Vercel 项目中运行迁移脚本：

```bash
# 在项目根目录运行
yarn workspace @charge-spec/web tsx packages/web/scripts/migrate-to-kv.ts
```

或者使用 Vercel CLI：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 运行迁移脚本
vercel env pull .env.local
yarn workspace @charge-spec/web tsx packages/web/scripts/migrate-to-kv.ts
```

### 4. 部署

```bash
# 推送代码到 GitHub
git add .
git commit -m "feat: 添加 Vercel KV 支持"
git push

# 在 Vercel Dashboard 部署，或使用 CLI
vercel --prod
```

## 📝 本地开发

### 方法一：使用 Vercel KV（推荐）

1. 拉取环境变量：

```bash
vercel env pull .env.local
```

2. 启动开发服务器：

```bash
yarn dev
```

### 方法二：使用本地数据（离线开发）

如果不想连接 Vercel KV，可以暂时使用本地数据：

```typescript
// 在 src/app/chargers/page.tsx 中
import { allChargers } from '@charge-spec/shared'
```

## 🔧 KV 工具函数

所有 KV 操作都封装在 `src/lib/kv.ts` 中：

```typescript
import {
  getAllChargers,
  getCharger,
  setCharger,
  setChargers,
  deleteCharger,
  clearAllChargers,
} from '@/lib/kv'

// 获取所有充电器
const chargers = await getAllChargers()

// 获取单个充电器
const charger = await getCharger('cdt-0-unknown-240w')

// 设置充电器
await setCharger(charger)

// 批量设置
await setChargers([charger1, charger2])

// 删除充电器
await deleteCharger('cdt-0-unknown-240w')

// 清空所有数据
await clearAllChargers()
```

## 📊 数据结构

### 充电器数据

```typescript
{
  id: string              // 唯一标识符
  brand: Brand           // 品牌
  model: string          // 型号
  displayName: string    // 显示名称
  power: {               // 功率配置
    maxPower: number
    configurations: Array<{
      voltage: number
      current: number
      power: number
    }>
  }
  protocols: Protocol[]  // 支持的协议
  ports: ConnectorPort[] // 接口配置
  description: string   // 描述
  features: string[]    // 特性列表
  // ... 更多字段
}
```

### KV 键设计

- `chargers:all` - 所有充电器 ID 列表（类型：`string[]`）
- `charger:{id}` - 单个充电器数据（类型：`Charger`）

示例：
```
chargers:all -> ["cdt-0-unknown-240w", "cdt-1----140w", ...]
charger:cdt-0-unknown-240w -> { id: "cdt-0-unknown-240w", ... }
```

## 🐛 故障排查

### 问题：KV 连接失败

**错误信息：** `Error: Cannot read properties of undefined (reading 'get')`

**解决方案：**
1. 确保已在 Vercel 创建 KV 数据库
2. 运行 `vercel env pull .env.local` 拉取环境变量
3. 检查 `.env.local` 文件是否存在

### 问题：迁移脚本失败

**错误信息：** `Error: Request failed with status code 401`

**解决方案：**
1. 检查 `KV_REST_API_TOKEN` 是否正确
2. 重新拉取环境变量：`vercel env pull .env.local --force`

### 问题：数据为空

**解决方案：**
1. 确保已运行迁移脚本
2. 检查 KV 数据库是否有数据：在 Vercel Dashboard → Storage → KV → Data Browser

## 💰 免费额度监控

在 Vercel Dashboard 中查看使用情况：

- **Storage** 标签 → 选择你的 KV 数据库
- 查看 **Usage** 部分

当前免费额度：
- 256 MB 存储
- 每天 10,000 次命令

## 📚 相关链接

- [Vercel KV 文档](https://vercel.com/docs/storage/vercel-kv)
- [Vercel KV 定价](https://vercel.com/docs/storage/vercel-kv/usage-and-pricing)
- [Redis 命令参考](https://redis.io/commands/)

## 🎯 下一步

1. ✅ 创建 Vercel KV 数据库
2. ✅ 导入充电器数据
3. ✅ 部署到 Vercel
4. ✅ 配置自定义域名（可选）
5. ✅ 设置定期备份（可选）

---

需要帮助？查看 [Vercel 文档](https://vercel.com/docs) 或提交 Issue。
