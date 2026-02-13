#!/usr/bin/env node

/**
 * Puppeteer 测试脚本
 * 使用本地 Chrome 浏览器进行 E2E 测试
 */

const fs = require('fs');
const http = require('http');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const RESULTS_FILE = '/tmp/puppeteer-test-results.json';

// 测试结果
const results = {
  timestamp: new Date().toISOString(),
  tests: [],
  summary: {
    total: 0,
    passed: 0,
    failed: 0
  }
};

// 辅助函数：截图并记录
async function screenshot(page, name, description) {
  const filename = `/tmp/${name}.png`;
  await page.screenshot({ path: filename, fullPage: true });
  console.log(`  📸 截图: ${filename}`);

  const test = {
    name,
    description,
    status: 'passed',
    screenshot: filename
  };
  results.tests.push(test);
  results.summary.passed++;
}

// 辅助函数：记录失败
async function fail(page, name, description, error) {
  const filename = `/tmp/${name}-error.png`;
  await page.screenshot({ path: filename, fullPage: true });
  console.log(`  ❌ 失败: ${filename} - ${error}`);

  const test = {
    name,
    description,
    status: 'failed',
    error: String(error),
    screenshot: filename
  };
  results.tests.push(test);
  results.summary.failed++;
}

// 测试套件
async function runTests() {
  console.log('🚀 启动 Puppeteer 测试...\n');

  const browser = await puppeteer.launch({
    headless: false, // 显示浏览器窗口
    executablePath: CHROME_PATH,
    args: ['--disable-web-security', '--disable-features=VizDisplayCompositor'],
    defaultViewport: null
  });

  console.log(`✅ Chrome 已启动`);

  const page = await browser.newPage();

  // 测试 1: 首页加载
  console.log('\n📋 测试 1: 首页加载...');
  try {
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle0', timeout: 10000 });

    const h1 = await page.$('h1');
    if (h1) {
      const text = await page.evaluate(el => el.textContent, h1);
      if (text && text.includes('充电头规格')) {
        await screenshot(page, '01-homepage', '首页正常加载');
        console.log('  ✅ 首页加载成功');
      } else {
        throw new Error('H1 标题不正确或未找到');
      }
    } else {
      throw new Error('H1 元素未找到');
    }
  } catch (error) {
    await fail(page, '01-homepage', '首页加载失败', error);
  }

  // 测试 2: 充电器列表页
  console.log('\n📋 测试 2: 充电器列表页...');
  try {
    await page.goto('http://localhost:3001/chargers', { waitUntil: 'networkidle0', timeout: 10000 });

    const cards = await page.$$('.bg-white.dark\\:bg-gray-800.rounded-lg');
    if (cards && cards.length > 0) {
      await screenshot(page, '02-chargers-list', '充电器列表页加载成功');
      console.log(`  ✅ 找到 ${cards.length} 个充电器卡片`);
    } else {
      throw new Error('充电器卡片未找到');
    }
  } catch (error) {
    await fail(page, '02-chargers-list', '充电器列表页加载失败', error);
  }

  // 测试 3: 搜索功能
  console.log('\n📋 测试 3: 搜索功能...');
  try {
    await page.goto('http://localhost:3001/chargers', { waitUntil: 'networkidle0', timeout: 10000 });

    // 等待页面加载
    await page.waitForTimeout(1000);

    // 查找搜索框
    const searchInput = await page.$('input[placeholder*="搜索"]');
    if (!searchInput) {
      throw new Error('搜索框未找到');
    }

    // 输入搜索内容
    await searchInput.type('Apple');
    await page.waitForTimeout(1000);

    // 检查结果
    const results = await page.$$('.bg-white.dark\\:bg-gray-800.rounded-lg');
    if (results && results.length > 0) {
      const firstText = await page.evaluate(el => el.textContent, results[0]);
      if (firstText && firstText.includes('Apple')) {
        await screenshot(page, '03-search', '搜索功能正常');
        console.log('  ✅ 搜索功能正常');
      } else {
        throw new Error('搜索结果不正确');
      }
    }
  } catch (error) {
    await fail(page, '03-search', '搜索功能测试失败', error);
  }

  // 测试 4: 详情页
  console.log('\n📋 测试 4: 充电器详情页...');
  try {
    await page.goto('http://localhost:3001/chargers/apple-a2653-30w', { waitUntil: 'networkidle0', timeout: 10000 });

    // 检查详情页内容
    const h1 = await page.$('h1');
    if (!h1) {
      throw new Error('详情页标题未找到');
    }

    const powerText = await page.evaluate(el => el.textContent, h1);
    if (powerText && powerText.includes('30W')) {
      await screenshot(page, '04-detail-page', '详情页加载成功');
      console.log('  ✅ 详情页加载成功');
    } else {
      throw new Error('详情页内容不正确');
    }
  } catch (error) {
    await fail(page, '04-detail-page', '详情页加载失败', error);
  }

  // 测试 5: 响应式设计 (移动端)
  console.log('\n📋 测试 5: 响应式设计 - 移动端...');
  try {
    await page.goto('http://localhost:3001/chargers', { waitUntil: 'networkidle0', timeout: 10000 });

    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    const cards = await page.$$('.bg-white.dark\\:bg-gray-800.rounded-lg');
    if (cards && cards.length > 0) {
      await screenshot(page, '05-responsive-mobile', '移动端响应式布局正常');
      console.log('  ✅ 移动端布局正常');
    } else {
      throw new Error('移动端布局失败');
    }
  } catch (error) {
    await fail(page, '05-responsive-mobile', '移动端响应式测试失败', error);
  }

  // 测试 6: 响应式设计 (桌面端)
  console.log('\n📋 测试 6: 响应式设计 - 桌面端...');
  try {
    await page.goto('http://localhost:3001/chargers', { waitUntil: 'networkidle0', timeout: 10000 });

    // 设置桌面端视口
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);

    const cards = await page.$$('.bg-white.dark\\:bg-gray-800.rounded-lg');
    if (cards && cards.length > 0) {
      await screenshot(page, '06-responsive-desktop', '桌面端响应式布局正常');
      console.log('  ✅ 桌面端布局正常');
    } else {
      throw new Error('桌面端布局失败');
    }
  } catch (error) {
    await fail(page, '06-responsive-desktop', '桌面端响应式测试失败', error);
  }

  // 测试 7: API 端点
  console.log('\n📋 测试 7: API 端点...');
  try {
    const response = await http.get('http://localhost:3001/api/chargers');

    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      if (data.chargers && data.chargers.length === 10) {
        await screenshot(page, '07-api-endpoint', 'API 端点正常');
        console.log(`  ✅ API 返回 ${data.chargers.length} 个充电器`);
      } else {
        throw new Error(`API 返回数量不正确: ${data.chargers ? data.chargers.length : 'undefined'}`);
      }
    } else {
      throw new Error(`API 返回状态码: ${response.statusCode}`);
    }
  } catch (error) {
    await fail(page, '07-api-endpoint', 'API 端点测试失败', error);
  }

  // 等待一下再关闭浏览器（截图查看）
  console.log('\n⏳ 等待 5 秒后关闭浏览器...');
  await page.waitForTimeout(5000);

  await browser.close();
  console.log('\n✅ 浏览器已关闭');
}

// 运行测试
runTests().then(() => {
  results.summary.total = results.tests.length;

  // 保存结果
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));

  console.log('\n' + '='.repeat(50));
  console.log('📊 测试完成总结');
  console.log('='.repeat(50));
  console.log(`✅ 通过: ${results.summary.passed}`);
  console.log(`❌ 失败: ${results.summary.failed}`);
  console.log(`📈 成功率: ${((results.summary.passed / results.summary.total) * 100).toFixed(1)}%`);
  console.log(`总共: ${results.summary.total} 个测试`);
  console.log('='.repeat(50));

  console.log(`\n📸 截图已保存到: /tmp/`);
  console.log(`📄 详细结果已保存到: ${RESULTS_FILE}`);
  console.log('\n提示: 使用以下命令查看截图：\n  open /tmp/01-homepage.png  # 首页\n  open /tmp/05-responsive-mobile.png  # 移动端\n  open /tmp/06-responsive-desktop.png  # 桌面端\n  open /tmp/07-api-endpoint.png  # API\n  open /tmp/*-error.png  # 错误截图\n');

  process.exit(results.summary.failed > 0 ? 0 : 1);
}).catch(error => {
  console.error('测试运行失败:', error);
  process.exit(1);
});
