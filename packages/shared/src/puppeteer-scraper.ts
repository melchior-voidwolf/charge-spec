/**
 * Puppeteer 充电头网数据抓取脚本
 * 使用无头浏览器自动加载所有数据
 *
 * Features:
 * - 自动滚动页面
 * - 自动点击"加载更多"按钮
 * - 提取所有充电器数据
 * - 去重并按格式输出
 *
 * Usage:
 *   yarn dlx tsx packages/shared/src/puppeteer-scraper.ts [maxScrolls] [outputFile]
 *
 * Examples:
 *   yarn dlx tsx packages/shared/src/puppeteer-scraper.ts 50
 *   yarn dlx tsx packages/shared/src/puppeteer-scraper.ts 100 ./all-chargers.ts
 */

import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { Charger, Brand, Protocol, ConnectorType } from './types.js';
import * as fs from 'fs/promises';

// 配置
const BASE_URL = 'https://www.chongdiantou.com/1746334876530.html';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/**
 * 从文章标题中提取充电头功率信息
 */
function extractPowerFromTitle(title: string): number | null {
  const powerMatch = title.match(/(\d{2,3})W/);
  if (powerMatch) {
    return parseInt(powerMatch[1], 10);
  }
  return null;
}

/**
 * 从标题中提取品牌名称
 */
function extractBrandFromTitle(title: string): Brand | string {
  const titleLower = title.toLowerCase();
  const brandMap: Record<string, Brand | string> = {
    'apple': Brand.APPLE,
    'anker': Brand.ANKER,
    '安克': Brand.ANKER,
    '小米': Brand.XIAOMI,
    'xiaomi': Brand.XIAOMI,
    '华为': Brand.HUAWEI,
    'huawei': Brand.HUAWEI,
    '荣耀': 'Honor',
    'honor': 'Honor',
    '三星': Brand.SAMSUNG,
    'samsung': Brand.SAMSUNG,
    'oppo': Brand.OPPO,
    'realme': 'realme',
    '真我': 'realme',
    'vivo': Brand.VIVO,
    '一加': Brand.ONEPLUS,
    'oneplus': Brand.ONEPLUS,
    '倍思': Brand.BASEUS,
    'baseus': Brand.BASEUS,
    '绿联': Brand.UGREEN,
    'ugreen': Brand.UGREEN,
    '倍仕达': 'Bsdgt',
    'bsdgt': 'Bsdgt',
    '希辉达': 'XIHUIDA',
    'xihuida': 'XIHUIDA',
    '米物': 'MIIIW',
    'miiiw': 'MIIIW',
    'redmi': 'Redmi',
    'belkin': Brand.BELKIN,
    'aukey': Brand.AUKEY,
    'ravpower': Brand.RAVPOWER,
    '酷态科': 'CUKTECH',
    'cuktech': 'CUKTECH',
    'mcdodo': 'Mcdodo',
    'momax': 'MOMAX',
    '洛克': 'ROCK',
    'rock': 'ROCK',
    '羽博': 'Yoobao',
    'yoobao': 'Yoobao',
    'dji': 'DJI',
    '联想': 'Lenovo',
    'lenovo': 'Lenovo',
    'thinkpad': 'ThinkPad',
    'lg': Brand.LG,
    'sony': Brand.SONY,
  };

  for (const [key, brand] of Object.entries(brandMap)) {
    if (titleLower.includes(key)) {
      return brand;
    }
  }

  return Brand.OTHER;
}

/**
 * 从标题中提取型号
 */
function extractModelFromTitle(title: string): string {
  const modelMatch = title.match(/[A-Z]?\d{4,}|[A-Z]{2,}-\d{2,}-[A-Z]{2,}/);
  if (modelMatch) {
    return modelMatch[0];
  }
  return '';
}

/**
 * 根据功率推断常见充电配置
 */
function inferPowerConfigurations(maxPower: number): Array<{ voltage: number; current: number; power: number }> {
  const configs: Array<{ voltage: number; current: number; power: number }> = [
    { voltage: 5, current: 3, power: 15 },
  ];

  if (maxPower >= 20) {
    configs.push({ voltage: 9, current: 2.22, power: 20 });
  }

  if (maxPower >= 30) {
    configs.push({ voltage: 9, current: 3, power: 27 });
    configs.push({ voltage: 15, current: 2, power: 30 });
  }

  if (maxPower >= 45) {
    configs.push({ voltage: 15, current: 3, power: 45 });
  }

  if (maxPower >= 65) {
    configs.push({ voltage: 20, current: 3.25, power: 65 });
  }

  if (maxPower >= 100) {
    configs.push({ voltage: 20, current: 5, power: 100 });
  }

  if (maxPower >= 140) {
    configs.push({ voltage: 28, current: 5, power: 140 });
  }

  return configs;
}

/**
 * 根据标题和品牌推断支持的协议
 */
function inferProtocols(title: string, brand: Brand | string): Protocol[] {
  const protocols: Protocol[] = [Protocol.PD, Protocol.PD_3_0];
  const titleLower = title.toLowerCase();

  if (titleLower.includes('pd 3.1') || title.includes('PD 3.1')) {
    protocols.push(Protocol.PD_3_1);
  }

  if (titleLower.includes('pps')) {
    protocols.push(Protocol.PPS);
  }

  if (titleLower.includes('qc')) {
    protocols.push(Protocol.QC_3_0);
    if (titleLower.includes('qc 4') || titleLower.includes('qc4')) {
      protocols.push(Protocol.QC_4_0);
    }
  }

  if (brand === Brand.HUAWEI || brand === 'Honor') {
    protocols.push(Protocol.SCP, Protocol.FCP);
  }

  if (brand === Brand.OPPO || brand === Brand.ONEPLUS || brand === 'realme') {
    protocols.push(Protocol.VOOC, Protocol.SUPER_VOOC, Protocol.WARP);
  }

  if (brand === Brand.SAMSUNG) {
    protocols.push(Protocol.AFC);
  }

  if (brand === Brand.APPLE) {
    protocols.push(Protocol.APPLE_FAST_CHARGE);
  }

  return [...new Set(protocols)];
}

/**
 * 推断接口类型和数量
 */
function inferPorts(title: string, maxPower: number): Array<{
  type: ConnectorType;
  count: number;
  maxPower: number;
  protocols: Protocol[];
}> {
  const titleLower = title.toLowerCase();
  const ports: Array<{
    type: ConnectorType;
    count: number;
    maxPower: number;
    protocols: Protocol[];
  }> = [];

  // USB-C 接口
  const cCount = (titleLower.match(/usb-c|type-c|2c1a|2c/gi)?.length || 0) || 1;
  ports.push({
    type: ConnectorType.USB_C,
    count: cCount > 1 ? cCount : 1,
    maxPower,
    protocols: [Protocol.PD, Protocol.PD_3_0],
  });

  // USB-A 接口
  if (titleLower.includes('1a') || titleLower.includes('2a') || titleLower.includes('usb-a')) {
    ports.push({
      type: ConnectorType.USB_A,
      count: 1,
      maxPower: Math.min(maxPower, 30),
      protocols: [Protocol.QC_3_0],
    });
  }

  return ports;
}

/**
 * 生成充电器 ID
 */
function generateChargerId(brand: string, model: string, maxPower: number): string {
  const brandStr = brand.toLowerCase().replace(/\s+/g, '-');
  const modelStr = model || maxPower.toString();
  return `${brandStr}-${modelStr}-${maxPower}w`;
}

/**
 * 从页面元素提取充电器信息（在浏览器上下文中执行）
 */
function extractChargerInBrowser() {
  const items = document.querySelectorAll('.list-item');
  const results: any[] = [];

  for (const el of Array.from(items)) {
    try {
      // 提取标题
      const titleEl = el.querySelector('.list-title a');
      const title = titleEl?.textContent?.trim() || '';

      if (!title) continue;

      // 过滤掉非充电头的内容
      const excludeKeywords = ['数据线', '移动电源', '充电宝', '车充', '无线充', '插排', '户外电源'];
      const titleLower = title.toLowerCase();
      if (excludeKeywords.some(keyword => titleLower.includes(keyword))) {
        continue;
      }

      // 必须包含功率信息
      const powerMatch = title.match(/(\d{2,3})W/);
      if (!powerMatch) continue;
      const maxPower = parseInt(powerMatch[1], 10);

      // 提取链接
      const linkEl = el.querySelector('a[href]');
      const link = linkEl?.getAttribute('href') || '';

      // 提取图片
      const imgEl = el.querySelector('img');
      const image = imgEl?.getAttribute('src') || imgEl?.getAttribute('data-src') || '';

      // 提取发布日期
      const dateEl = el.querySelector('.date, .time, time');
      const dateText = dateEl?.textContent?.trim() || '';

      results.push({
        title,
        maxPower,
        link,
        image,
        dateText,
      });
    } catch (error) {
      // 跳过错误的项目
    }
  }

  return results;
}

/**
 * 将充电器数据导出为 TypeScript 代码
 */
function generateTypeScriptCode(chargers: Charger[]): string {
  const imports = `import { Charger, Brand, Protocol, ConnectorType } from './types.js';

export const scrapedChargers: Charger[] = [
`;

  const data = chargers.map(charger => {
    const cleaned = JSON.stringify(charger, (key, value) =>
      value instanceof Date ? value.toISOString() : value
    , 2);
    return `  ${cleaned},`;
  }).join('\n');

  return `${imports}${data}\n];\n`;
}

/**
 * 主抓取函数
 */
async function main() {
  const args = process.argv.slice(2);
  const maxScrolls = parseInt(args[0]) || 50; // 默认最多滚动50次
  const outputFile = args[1] || './packages/shared/src/all-chargers.ts';

  console.log('='.repeat(60));
  console.log('充电头网数据抓取工具 (Puppeteer版)');
  console.log('='.repeat(60));
  console.log(`目标URL: ${BASE_URL}`);
  console.log(`最大滚动次数: ${maxScrolls}`);
  console.log(`输出文件: ${outputFile}`);
  console.log('');

  const browser = await puppeteer.launch({
    headless: false, // 显示浏览器以便观察
    executablePath: CHROME_PATH,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
    ],
  });

  try {
    const page = await browser.newPage();

    // 设置视口大小
    await page.setViewport({ width: 1920, height: 1080 });

    // 导航到页面
    console.log('正在加载页面...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    console.log('页面加载完成\n');

    // 等待内容加载
    await page.waitForSelector('.list-item', { timeout: 10000 });

    const allChargers: Charger[] = [];
    const seenTitles = new Set<string>();
    let scrollCount = 0;
    let noNewDataCount = 0;

    while (scrollCount < maxScrolls) {
      // 在浏览器中提取数据
      const items = await page.evaluate(extractChargerInBrowser);

      // 处理并去重
      let newCount = 0;
      for (const item of items) {
        try {
          // 提取品牌和型号
          const brand = extractBrandFromTitle(item.title);
          const model = extractModelFromTitle(item.title);
          const protocols = inferProtocols(item.title, brand);
          const ports = inferPorts(item.title, item.maxPower);
          const powerConfigurations = inferPowerConfigurations(item.maxPower);

          const id = generateChargerId(brand as string, model, item.maxPower);

          // 去重
          if (!seenTitles.has(id)) {
            seenTitles.add(id);

            const isGaN = item.title.toLowerCase().includes('gan') || item.title.includes('氮化镓');
            const hasFoldingPlug = item.title.toLowerCase().includes('folding') ||
                                   item.title.includes('折叠') ||
                                   item.title.includes('可折叠');

            const charger: Charger = {
              id,
              brand,
              model,
              displayName: item.title,
              power: {
                maxPower: item.maxPower,
                configurations: powerConfigurations,
              },
              protocols,
              ports,
              isGaN,
              hasFoldingPlug,
              images: {
                thumbnail: item.image || undefined,
              },
              description: `来自充电头网的评测数据。发布日期: ${item.dateText || '未知'}`,
              officialUrl: item.link.startsWith('http') ? item.link : `https://www.chongdiantou.com${item.link}`,
              releaseYear: new Date().getFullYear(),
              manufacturedIn: '中国',
              certifications: ['CCC'],
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            allChargers.push(charger);
            newCount++;
          }
        } catch (error) {
          console.error('处理项目时出错:', error);
        }
      }

      scrollCount++;
      console.log(`[滚动 ${scrollCount}] 找到 ${items.length} 个项目，新增 ${newCount} 个充电器，总计 ${allChargers.length}`);

      // 如果连续多次没有新数据，停止
      if (newCount === 0) {
        noNewDataCount++;
        console.log(`  -> 没有新数据 (${noNewDataCount}/${3})`);
        if (noNewDataCount >= 3) {
          console.log('\n连续3次没有新数据，停止抓取');
          break;
        }
      } else {
        noNewDataCount = 0;
      }

      // 尝试查找并点击"加载更多"按钮
      const loadMoreExists = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.some(btn =>
          btn.textContent?.includes('加载更多') ||
          btn.textContent?.includes('加载')
        );
      });

      if (loadMoreExists) {
        console.log('  -> 找到"加载更多"按钮，点击...');
        try {
          await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const loadMoreBtn = buttons.find(btn =>
              btn.textContent?.includes('加载更多') ||
              btn.textContent?.includes('加载')
            );
            if (loadMoreBtn) {
              (loadMoreBtn as HTMLElement).click();
            }
          });

          // 等待新内容加载 - 使用新API
          await new Promise(resolve => setTimeout(resolve, 2500));
        } catch (error) {
          console.error('  -> 点击按钮失败:', error);
        }
      } else {
        console.log('  -> 未找到"加载更多"按钮，尝试滚动到底部...');
        // 滚动到页面底部
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });

        // 等待内容加载
        await new Promise(resolve => setTimeout(resolve, 2500));
      }

      // 检查是否到达页面底部
      const reachedBottom = await page.evaluate(() => {
        const scrollPosition = window.scrollY + window.innerHeight;
        const threshold = 100;
        return scrollPosition >= document.body.scrollHeight - threshold;
      });

      if (reachedBottom && !loadMoreExists) {
        console.log('\n已到达页面底部且没有"加载更多"按钮，停止抓取');
        break;
      }
    }

    // 生成 TypeScript 代码
    console.log('\n生成 TypeScript 代码...');
    const code = generateTypeScriptCode(allChargers);

    // 保存到文件
    await fs.writeFile(outputFile, code, 'utf-8');
    console.log(`\n数据已保存到: ${outputFile}`);

    // 打印统计信息
    const brands = new Set(allChargers.map(c => c.brand));
    const powerRange = {
      min: Math.min(...allChargers.map(c => c.power.maxPower)),
      max: Math.max(...allChargers.map(c => c.power.maxPower)),
    };

    console.log('\n' + '='.repeat(60));
    console.log('统计信息:');
    console.log(`- 总数: ${allChargers.length}`);
    console.log(`- 品牌数: ${brands.size}`);
    console.log(`- 功率范围: ${powerRange.min}W - ${powerRange.max}W`);
    console.log(`- 品牌列表: ${Array.from(brands).join(', ')}`);
    console.log(`- 滚动次数: ${scrollCount}`);
    console.log('='.repeat(60));

  } finally {
    await browser.close();
  }
}

// 运行
main().catch(console.error);
