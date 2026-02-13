#!/bin/bash

echo "========================================"
echo "充电头规格网站 - 手动测试"
echo "========================================"
echo ""

# 检查服务器是否运行
if ! lsof -ti:3000 > /dev/null 2>&1; then
    echo "❌ 开发服务器未运行"
    echo "请先运行: yarn dev"
    exit 1
fi

echo "✅ 开发服务器正在运行"
echo ""

# 测试首页
echo "测试 1: 首页加载..."
curl -s http://localhost:3000 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ 首页可访问"
else
    echo "❌ 首页无法访问"
fi
echo ""

# 测试充电器列表页
echo "测试 2: 充电器列表页..."
curl -s http://localhost:3000/chargers > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ 列表页可访问"
else
    echo "❌ 列表页无法访问"
fi
echo ""

# 测试详情页
echo "测试 3: 充电器详情页..."
curl -s http://localhost:3000/chargers/apple-a2653-30w > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ 详情页可访问"
else
    echo "❌ 详情页无法访问"
fi
echo ""

# 测试 API
echo "测试 4: API 端点..."
RESPONSE=$(curl -s http://localhost:3000/api/chargers)
if [ $? -eq 0 ]; then
    CHARGER_COUNT=$(echo "$RESPONSE" | grep -o '"count":[0-9]*' | grep -o '[0-9]*' | head -1)
    echo "✅ API 可访问 - 找到 $CHARGER_COUNT 个充电器"
else
    echo "❌ API 无法访问"
fi
echo ""

# 测试 sitemap
echo "测试 5: XML Sitemap..."
curl -s http://localhost:3000/sitemap.xml > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Sitemap 可访问"
else
    echo "❌ Sitemap 无法访问"
fi
echo ""

echo "========================================"
echo "基础测试完成"
echo "========================================"
