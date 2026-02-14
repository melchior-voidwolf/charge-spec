# 🚀 Vercel 部署指南

本指南将帮助你将充电头规格网站部署到 Vercel，并使用 Vercel KV 存储数据。

## 前置要求

- [x] GitHub 账户
- [x] Vercel 账户（可以用 GitHub 登录）
- [x] Node.js 18+ 和 Yarn 4+

## 步骤 1：在 Vercel 创建项目

1. 访问 [vercel.com](https://vercel.com)
2. 点击 **"Add New..."** → **"Project"**
3. 导入你的 GitHub 仓库 `charge-spec`
4. 配置项目：
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (根目录)
   - **Build Command**: `yarn build`
   - **Output Directory**: `packages/web/.next`
5. 点击 **Deploy**

## 步骤 2：创建 KV 数据库

1. 在项目页面，点击 **Storage** 标签
2. 点击 **Create Database**
3. 选择 **KV (Redis)**
4. 点击 **Create**

Vercel 会自动注入以下环境变量到你的项目：
- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

## 步骤 3：导入数据

在本地运行迁移脚本：

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 拉取环境变量
vercel env pull .env.local

# 4. 运行迁移脚本
yarn workspace @charge-spec/web migrate:kv
```

## 步骤 4：重新部署

数据导入后，触发新的部署：

```bash
# 方式一：推送新 commit
git commit --allow-empty -m "chore: 触发 Vercel 部署"
git push

# 方式二：使用 Vercel CLI
vercel --prod
```

## 步骤 5：验证部署

访问你的 Vercel 项目 URL（格式：`your-project.vercel.app`）：

- ✅ 首页正常显示
- ✅ 充电器列表页面显示数据
- ✅ 充电器详情页面正常工作

## 自定义域名（可选）

1. 在项目页面点击 **Settings** → **Domains**
2. 点击 **Add** 添加域名
3. 按照提示配置 DNS 记录

## 本地开发（连接 Vercel KV）

```bash
# 拉取环境变量
vercel env pull .env.local

# 启动开发服务器
yarn dev
```

## 故障排查

### 问题：构建失败

**可能原因：** 依赖安装失败

**解决方案：**
```bash
# 检查 package.json 配置
cat vercel.json

# 确保安装命令正确
yarn install
```

### 问题：KV 连接失败

**可能原因：** 环境变量未正确设置

**解决方案：**
1. 检查 Vercel 项目设置 → Settings → Environment Variables
2. 确保 KV 相关变量存在
3. 重新拉取环境变量：`vercel env pull .env.local --force`

### 问题：数据为空

**解决方案：**
1. 确保已运行迁移脚本
2. 在 Vercel Dashboard → Storage → KV → Data Browser 检查数据
3. 重新运行迁移脚本

## 费用说明

### Vercel Hosting（免费）

- ✅ 无限请求
- ✅ 100GB 带宽/月
- ✅ Serverless Functions 1000小时/月

### Vercel KV（免费）

- ✅ 256 MB 存储
- ✅ 每天 10,000 次命令

**当前项目预计使用：**
- 存储：~5 MB（124 个充电器数据）
- 命令次数：~1000/天（每个页面访问约 10-20 次命令）

## 相关文档

- [Vercel KV 完整配置指南](./docs/vercel-kv-setup.md)
- [Vercel 官方文档](https://vercel.com/docs)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
