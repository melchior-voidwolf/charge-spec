# Vercel 部署快速参考

## 🚀 一键部署流程

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署项目
vercel

# 4. 创建 KV 数据库（在 Vercel Dashboard 操作）
#    Dashboard → Storage → Create Database → KV

# 5. 拉取环境变量
vercel env pull .env.local

# 6. 导入数据到 KV
yarn workspace @charge-spec/web migrate:kv

# 7. 生产部署
vercel --prod
```

## 📦 已创建的文件

### 配置文件
- ✅ `vercel.json` - Vercel 部署配置
- ✅ `packages/web/src/lib/kv.ts` - KV 存储工具函数
- ✅ `packages/web/.env.example` - 环境变量示例

### API 路由
- ✅ `packages/web/src/app/api/chargers/route.ts` - 获取所有充电器
- ✅ `packages/web/src/app/api/chargers/[id]/route.ts` - 获取单个充电器

### 脚本和文档
- ✅ `packages/web/scripts/migrate-to-kv.ts` - 数据迁移脚本
- ✅ `DEPLOY.md` - 完整部署指南
- ✅ `docs/vercel-kv-setup.md` - KV 详细配置指南

## 🔑 环境变量

创建 KV 数据库后，Vercel 自动注入：
- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

## 📊 费用说明

**全部免费：**
- Vercel Hosting: 无限请求，100GB 带宽/月
- Vercel KV: 256MB 存储，10000 命令/天

**预计使用：**
- 存储: ~5MB（124 个充电器）
- 命令: ~1000/天

## 🎯 域名

**免费二级域名：**
- `your-project.vercel.app`（自动分配）

**自定义域名：**
- 在 Vercel Dashboard → Settings → Domains 添加

## 📚 相关链接

- [Vercel 完整部署指南](../DEPLOY.md)
- [Vercel KV 详细配置](./vercel-kv-setup.md)
- [Vercel 官方文档](https://vercel.com/docs)
