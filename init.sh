#!/bin/bash
# Charge Spec - Development Environment Init Script
# 用于启动 Next.js 开发服务器

set -e

echo "======================================"
echo "Charge Spec - Development Server"
echo "======================================"

# 检查是否安装了依赖
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    yarn install
fi

# 检查端口是否被占用
PORT=3000
while lsof -ti:$PORT > /dev/null 2>&1; do
    echo "⚠️  Port $PORT is already in use. Trying next port..."
    PORT=$((PORT + 1))
done

echo ""
echo "🚀 Starting Next.js development server on port $PORT..."
echo "📝 App will be available at http://localhost:$PORT"
echo ""
echo "Press Ctrl+C to stop the server"
echo "======================================"
echo ""

# 启动开发服务器
cd packages/web && yarn dev --port $PORT
