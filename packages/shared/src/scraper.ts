/**
 * 充电头网数据抓取脚本
 * Scrapes charger data from chongdiantou.com
 *
 * NOTE: 此网站使用客户端JavaScript分页。当前的简单HTTP请求方式只能获取首页的15个项目。
 * 如需加载更多数据，需要使用Puppeteer/Playwright等无头浏览器工具来执行JavaScript。
 *
 * Usage:
 *   yarn dlx tsx packages/shared/src/scraper.ts [pages] [outputFile]
 *
 * Examples:
 *   yarn dlx tsx packages/shared/src/scraper.ts 1
 *   yarn dlx tsx packages/shared/src/scraper.ts 5 ./my-chargers.ts
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { Charger, Brand, Protocol, ConnectorType } from './types.js';

// 配置
const BASE_URL = 'https://www.chongdiantou.com';
const CONCURRENT_REQUESTS = 3;
const DELAY_BETWEEN_REQUESTS = 1000; // ms

/**
 * 从文章标题中提取充电头功率信息
 */
function extractPowerFromTitle(title: string): number | null {
  // 匹配常见功率格式: 20W, 65W, 100W, 140W, etc.
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

  // 检查已知品牌
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
  // 匹配常见型号格式: A1234, MDY-12-ED, etc.
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
    { voltage: 5, current: 3, power: 15 }, // 5V/3A = 15W
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

  // 检查 PD 3.1
  if (titleLower.includes('pd 3.1') || title.includes('PD 3.1')) {
    protocols.push(Protocol.PD_3_1);
  }

  // 检查 PPS
  if (titleLower.includes('pps')) {
    protocols.push(Protocol.PPS);
  }

  // 检查 QC
  if (titleLower.includes('qc')) {
    protocols.push(Protocol.QC_3_0);
    if (titleLower.includes('qc 4') || titleLower.includes('qc4')) {
      protocols.push(Protocol.QC_4_0);
    }
  }

  // 品牌特定协议
  if (brand === Brand.HUAWEI || brand === 'Honor') {
    protocols.push(Protocol.SCP, Protocol.FCP);
  }

  if (brand === Brand.OPPO || brand === Brand.ONEPLUS) {
    protocols.push(Protocol.VOOC, Protocol.WARP);
  }

  if (brand === Brand.SAMSUNG) {
    protocols.push(Protocol.AFC);
  }

  if (brand === Brand.APPLE) {
    protocols.push(Protocol.APPLE_FAST_CHARGE);
  }

  return [...new Set(protocols)]; // 去重
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

  // USB-C 接口 (几乎所有现代充电器都有)
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
 * 从文章列表项提取充电器信息
 */
function extractChargerFromListItem(
  $: cheerio.CheerioAPI,
  item: any,
  index: number
): Partial<Charger> | null {
  // 提取标题 - 直接使用传入的 $ 上下文查找 .list-item 内的元素
  const $item = $(item);

  // 在 .list-item 上下文中查找标题
  const title = $item.find('.list-title a').first().text().trim() ||
                $item.find('h2.list-title').first().text().trim() ||
                $item.find('h2').first().text().trim() ||
                '';

  // 过滤掉非充电头的内容
  const excludeKeywords = ['数据线', '移动电源', '充电宝', '车充', '无线充', '插排', '户外电源', 'energy storage'];
  const titleLower = title.toLowerCase();
  if (excludeKeywords.some(keyword => titleLower.includes(keyword))) {
    return null;
  }

  // 扩展包含关键词 - 更宽松的匹配
  const includeKeywords = [
    '充电器', '充电头', '适配器', 'charger', 'adapter',
    '快充', '氮化镓', 'gan', 'pd快充', '充电站'
  ];
  const hasKeyword = includeKeywords.some(keyword => titleLower.includes(keyword));

  // 提取链接
  const link = $item.find('a').first().attr('href');
  if (!link) {
    return null;
  }

  // 如果没有明确的关键词，但包含功率信息，仍然尝试提取
  // 这样可以捕获如 "OPPO 100W小方瓶" 这样的标题
  const maxPower = extractPowerFromTitle(title);
  if (!maxPower) {
    return null;
  }

  // 如果没有关键词且有功率，检查是否可能是充电器
  if (!hasKeyword) {
    // 必须有功率和品牌才考虑
    const brand = extractBrandFromTitle(title);
    if (brand === Brand.OTHER) {
      return null;
    }
  }

  // 提取图片
  const image = $item.find('img').first().attr('src') ||
                $item.find('img').first().attr('data-src');

  // 提取发布日期
  const dateText = $item.find('.date, .time, time').first().text().trim();

  // 提取品牌
  const brand = extractBrandFromTitle(title);

  // 提取型号
  const model = extractModelFromTitle(title);

  // 推断其他信息
  const protocols = inferProtocols(title, brand);
  const ports = inferPorts(title, maxPower);
  const powerConfigurations = inferPowerConfigurations(maxPower);

  // 判断是否为 GaN
  const isGaN = title.toLowerCase().includes('gan') ||
                title.includes('氮化镓');

  // 判断是否有折叠插脚
  const hasFoldingPlug = title.toLowerCase().includes('folding') ||
                         title.includes('折叠') ||
                         title.includes('可折叠');

  return {
    id: generateChargerId(brand as string, model, maxPower),
    brand,
    model,
    displayName: title,
    power: {
      maxPower,
      configurations: powerConfigurations,
    },
    protocols,
    ports,
    isGaN,
    hasFoldingPlug,
    images: {
      thumbnail: image ? (image.startsWith('http') ? image : BASE_URL + image) : undefined,
    },
    description: `来自充电头网的评测数据。发布日期: ${dateText || '未知'}`,
    officialUrl: link.startsWith('http') ? link : BASE_URL + link,
    releaseYear: new Date().getFullYear(),
    manufacturedIn: '中国',
    certifications: ['CCC'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * 获取评测文章列表页面
 */
async function fetchReviewListPage(pageNumber: number = 1): Promise<cheerio.CheerioAPI | null> {
  try {
    // 这里的 URL 格式可能需要调整，根据实际网站结构
    const url = pageNumber === 1
      ? 'https://www.chongdiantou.com/1746334876530.html'
      : `https://www.chongdiantou.com/1746334876530.html?page=${pageNumber}`;

    console.log(`正在获取第 ${pageNumber} 页: ${url}`);
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      timeout: 30000,
    });

    return cheerio.load(response.data);
  } catch (error) {
    console.error(`获取页面 ${pageNumber} 失败:`, error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * 从列表页面提取所有充电器
 */
function extractChargersFromListPage($: cheerio.CheerioAPI): Charger[] {
  const chargers: Charger[] = [];

  // 这些选择器需要根据实际页面结构调整
  const possibleSelectors = [
    '.article-item',
    '.post-item',
    '.review-item',
    '.list-item',
    'article',
    '.item',
  ];

  let items: cheerio.Cheerio<any> | null = null;

  for (const selector of possibleSelectors) {
    items = $(selector);
    if (items.length > 0) {
      console.log(`使用选择器 "${selector}" 找到 ${items.length} 个项目`);
      break;
    }
  }

  if (!items || items.length === 0) {
    // 尝试从 main 或 content 区域中的所有链接提取
    items = $('.content a, .main a, #content a');
    if (items.length > 0) {
      console.log(`从内容区域找到 ${items.length} 个链接`);
    }
  }

  if (items && items.length > 0) {
    items.each((index, element) => {
      try {
        const charger = extractChargerFromListItem($, element, index);
        if (charger) {
          chargers.push(charger as Charger);
        }
      } catch (error) {
        console.error(`提取第 ${index} 项时出错:`, error instanceof Error ? error.message : error);
      }
    });
  }

  return chargers;
}

/**
 * 延迟函数
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 主抓取函数 - 抓取多页数据
 */
export async function scrapeChongdianTou(maxPages: number = 5): Promise<Charger[]> {
  console.log(`开始抓取充电头网数据，最多抓取 ${maxPages} 页...`);
  const allChargers: Charger[] = [];
  const seenIds = new Set<string>();

  for (let page = 1; page <= maxPages; page++) {
    const $ = await fetchReviewListPage(page);
    if (!$) {
      console.log(`页面 ${page} 获取失败或为空，停止抓取`);
      break;
    }

    const chargers = extractChargersFromListPage($);

    // 去重
    let newCount = 0;
    for (const charger of chargers) {
      if (!seenIds.has(charger.id)) {
        seenIds.add(charger.id);
        allChargers.push(charger);
        newCount++;
      }
    }

    console.log(`第 ${page} 页: 找到 ${chargers.length} 个充电器，其中 ${newCount} 个是新数据`);

    // 如果这一页没有新数据，可能已经到最后一页
    if (newCount === 0 && page > 1) {
      console.log('没有更多新数据，停止抓取');
      break;
    }

    // 延迟以避免请求过于频繁
    if (page < maxPages) {
      await delay(DELAY_BETWEEN_REQUESTS);
    }
  }

  console.log(`\n抓取完成！共获取 ${allChargers.length} 个充电器数据`);
  return allChargers;
}

/**
 * 将充电器数据导出为 TypeScript 代码
 */
export function generateTypeScriptCode(chargers: Charger[]): string {
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
 * 主函数 - 执行抓取并保存结果
 */
async function runMain() {
  const args = process.argv.slice(2);
  const maxPages = parseInt(args[0]) || 5;
  const outputFile = args[1] || './scraped-chargers.ts';

  console.log('='.repeat(60));
  console.log('充电头网数据抓取工具');
  console.log('='.repeat(60));

  const chargers = await scrapeChongdianTou(maxPages);

  if (chargers.length === 0) {
    console.log('未抓取到任何数据');
    return;
  }

  // 生成 TypeScript 代码
  const code = generateTypeScriptCode(chargers);

  // 保存到文件
  const fs = await import('fs/promises');
  await fs.writeFile(outputFile, code, 'utf-8');

  console.log(`\n数据已保存到: ${outputFile}`);

  // 打印统计信息
  const brands = new Set(chargers.map(c => c.brand));
  const powerRange = {
    min: Math.min(...chargers.map(c => c.power.maxPower)),
    max: Math.max(...chargers.map(c => c.power.maxPower)),
  };

  console.log('\n统计信息:');
  console.log(`- 总数: ${chargers.length}`);
  console.log(`- 品牌数: ${brands.size}`);
  console.log(`- 功率范围: ${powerRange.min}W - ${powerRange.max}W`);
  console.log(`- 品牌列表: ${Array.from(brands).join(', ')}`);
}

// 如果直接运行此脚本
const isMain = import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`;
if (isMain) {
  runMain().catch(console.error);
}

// 同时导出 main 函数供外部调用
export const main = runMain;
