# Charge Spec - 充电头规格网站

一个展示各类充电头技术规格的网站，支持多品牌、多协议的充电器查询和对比。

## 技术栈

- **Web**: Next.js 15 + TypeScript + Tailwind CSS
- **Mobile**: React Native (后期规划)
- **包管理**: Yarn Workspaces (Monorepo)

## 项目结构

```
charge-spec/
├── packages/
│   ├── web/          # Next.js Web 应用
│   ├── shared/       # 共享类型和工具
│   └── mobile/       # React Native App (未来)
├── package.json      # 根 package.json
└── README.md
```

## 开始开发

```bash
# 安装依赖
yarn install

# 启动开发服务器
yarn dev

# 构建生产版本
yarn build
```

## 开发规范

- 使用 TypeScript 编写代码
- 遵循 ESLint 和 Prettier 配置
- 提交前运行 `yarn lint` 和 `yarn type-check`
