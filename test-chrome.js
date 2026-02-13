const fs = require('fs');
const http = require('http');
const { execSync } = require('child_process');

const RESULTS = '/tmp/chrome-test-results.json';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

let results = {
  timestamp: new Date().toISOString(),
  tests: [],
  summary: { total: 0, passed: 0, failed: 0 }
};

async function screenshot(page, name) {
  const path = \`/tmp/\${name}.png\`;
  await page.screenshot({ path, fullPage: true });
  console.log(\`  📸 \${name}\`);
}

async function pass(name, description) {
  const test = { name, description, status: 'passed', screenshot: \`\${name}.png\` };
  results.tests.push(test);
  results.summary.passed++;
  console.log(\`  ✅ \${name}: \${description}\`);
}

async function fail(name, description, error) {
  const test = { name, description, status: 'failed', screenshot: \`\${name}-error.png\`, error: String(error) };
  results.tests.push(test);
  results.summary.failed++;
  console.log(\`  ❌ \${name}: \${description}\`);
  console.error(error);
}

async function runTests() {
  console.log('🚀 启动 Chrome 浏览器测试...\n');

  const chrome = execSync(
    \`"\${CHROME_PATH}" --args="--disable-web-security --disable-features=VizDisplayCompositor --remote-debugging-port=9222"\`,
    { detached: true }
  );

  await new Promise(resolve => setTimeout(resolve, 3000));

  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: CHROME_PATH,
    args: ['--disable-web-security', '--remote-debugging-port=9222']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    // 测试 1: 首页
    console.log('📋 测试 1/7: 首页加载...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle0', timeout: 10000 });
    const h1 = await page.$('h1');
    if (h1 && (await h1.evaluate(el => el.textContent)).includes('充电头规格')) {
      await pass('01-homepage', '首页正常加载');
    } else {
      await fail('01-homepage', '首页H1标题或内容不正确');
    }

    // 测试 2: 列表页
    console.log('📋 测试 2/7: 充电器列表页...');
    await page.goto('http://localhost:3001/chargers', { waitUntil: 'networkidle0', timeout: 10000 });
    const cards = await page.$$('.bg-white.dark\\\\.bg-gray-800.rounded-lg');
    if (cards && cards.length > 0) {
      await pass('02-chargers-list', \`找到 \${cards.length} 个充电器\`);
    } else {
      await fail('02-chargers-list', '充电器卡片未找到');
    }

    // 测试 3: 搜索功能
    console.log('📋 测试 3/7: 搜索功能...');
    await page.goto('http://localhost:3001/chargers', { waitUntil: 'networkidle0', timeout: 10000 });
    const searchInput = await page.$('input[placeholder*="搜索"]');
    if (searchInput) {
      await searchInput.type('Apple');
      await page.waitForTimeout(1000);
      const results = await page.$$('.bg-white.dark\\\\.bg-gray-800.rounded-lg'));
      const firstText = await page.evaluate(el => el.textContent, results[0]);
      if (firstText && firstText.includes('Apple')) {
        await pass('03-search', '搜索功能正常 - 可以搜索品牌');
      } else {
        await fail('03-search', '搜索结果不正确');
      }
    } else {
      await fail('03-search', '搜索框未找到');
    }

    await browser.close();

    console.log('\\n📊 测试完成');
    console.log(\`✅ 通过: \${results.summary.passed}/\${results.summary.total}\`);
    console.log(\`❌ 失败: \${results.summary.failed}/\${results.summary.total}\`);
    console.log(\`成功率: \${((results.summary.passed / results.summary.total) * 100).toFixed(1)}%\`);

    fs.writeFileSync(RESULTS, JSON.stringify(results, null, 2));
    console.log(\`📄 结果已保存到: \${RESULTS}\`);

  } catch (error) {
    console.error('❌ 测试运行失败:', error);
    process.exit(1);
  }

runTests();
