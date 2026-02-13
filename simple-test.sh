#!/bin/bash

echo "========================================"
echo "充电头规格网站 - 简单测试"
echo "========================================"
echo ""

# 测试首页
echo "测试 1: 首页..."
curl -sf http://localhost:3001 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ 首页可访问"
else
    echo "❌ 首页无法访问"
fi
echo ""

# 测试列表页
echo "测试 2: 充电器列表页..."
curl -sf http://localhost:3001/chargers > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ 列表页可访问"
else
    echo "❌ 列表页无法访问"
fi
echo ""

# 测试详情页
echo "测试 3: 充电器详情页..."
curl -sf http://localhost:3001/chargers/apple-a2653-30w > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ 详情页可访问"
else
    echo "❌ 详情页无法访问"
fi
echo ""

# 测试品牌页
echo "测试 4: 品牌页面..."
curl -sf http://localhost:3001/brand/Apple > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ 品牌页可访问"
else
    echo "❌ 品牌页无法访问"
fi
echo ""

# 测试 API
echo "测试 5: API 端点..."
curl -sf http://localhost:3001/api/chargers > /dev/null 2>&1
RESPONSE=$(curl -s http://localhost:3001/api/chargers)
if [ $? -eq 0 ]; then
    COUNT=$(echo "$RESPONSE" | grep -o '"count":[0-9]*' | grep -o '[0-9]*')
    echo "✅ API 可访问 - 返回 $COUNT 个充电器"
else
    echo "❌ API 无法访问"
fi
echo ""

# 测试 sitemap
echo "测试 6: Sitemap..."
curl -sf http://localhost:3001/sitemap.xml > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Sitemap 可访问"
else
    echo "❌ Sitemap 无法访问"
fi
echo ""

echo "========================================"
echo "基础测试完成"
echo "========================================"
echo ""

# 检查是否有截图工具
if command -v screenshot >/dev/null 2>&1; then
    echo "💡 提示: 使用 screencapture 命令进行截图测试"
    echo "   示例: screencapture -T 5 http://localhost:3001"
fi
echo ""

# 检查端口占用
echo "🔍 端口状态检查:"
lsof -ti:3000 2>/dev/null | head -1 || echo "  3000 端口空闲（可用）"
lsof -ti:3001 2>/dev/null | head -1 || echo "  3001 端口被占用"
echo ""

# 提供下一步建议
echo ""
echo "📝 建议的下一步测试:"
echo "  1. 使用浏览器手动测试响应式布局"
echo "  2. 验证搜索和筛选功能是否工作"
echo "  3. 测试深色模式（如已实现）"
echo "  4. 使用 Chrome DevTools 检查性能"
echo ""
echo "💻 要在浏览器中手动测试，请访问:"
echo "   http://localhost:3001"
echo ""
