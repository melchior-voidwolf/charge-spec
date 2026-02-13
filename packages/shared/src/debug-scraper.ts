/**
 * Debug scraper to see what we're extracting
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

async function debugScraper() {
  const response = await axios.get('https://www.chongdiantou.com/1746334876530.html');
  const $ = cheerio.load(response.data);

  console.log('=== Debugging Item Extraction ===\n');

  // Find items
  const items = $('.list-item');
  console.log(`Found ${items.length} .list-item elements\n`);

  items.each((index, element) => {
    const $item = $(element);
    const title = $item.find('.list-title a, h2 a, h3 a').first().text().trim();
    const link = $item.find('a').first().attr('href');
    const image = $item.find('img').first().attr('src') || $item.find('img').first().attr('data-src');

    console.log(`Item ${index + 1}:`);
    console.log(`  Title: ${title.substring(0, 80)}`);
    console.log(`  Link: ${link}`);
    console.log(`  Image: ${image?.substring(0, 80)}`);
    console.log(`  Has power: ${title.match(/\d{2,3}W/g) ? 'Yes' : 'No'}`);

    // Check keywords
    const excludeKeywords = ['数据线', '移动电源', '充电宝', '车充', '无线充', '插排', '户外电源', 'energy storage'];
    const includeKeywords = ['充电器', '充电头', '适配器', 'charger', 'adapter', '快充', '氮化镓', 'gan', 'pd快充', '充电站'];
    const titleLower = title.toLowerCase();

    const hasExclude = excludeKeywords.some(k => titleLower.includes(k));
    const hasInclude = includeKeywords.some(k => titleLower.includes(k));

    console.log(`  Has exclude keyword: ${hasExclude}`);
    console.log(`  Has include keyword: ${hasInclude}`);

    // Extract power
    const powerMatch = title.match(/(\d{2,3})W/);
    const power = powerMatch ? parseInt(powerMatch[1], 10) : null;
    console.log(`  Power: ${power}W`);

    // Brand check
    const brandKeywords: Record<string, string> = {
      'oppo': 'OPPO',
      '小米': 'Xiaomi',
      '华为': 'Huawei',
      '荣耀': 'Honor',
      '倍思': 'Baseus',
      '绿联': 'UGREEN',
    };
    let brand = 'Other';
    for (const [key, value] of Object.entries(brandKeywords)) {
      if (titleLower.includes(key)) {
        brand = value;
        break;
      }
    }
    console.log(`  Brand: ${brand}`);

    // Would this pass filters?
    let wouldPass = true;
    const reasons = [];

    if (hasExclude) {
      wouldPass = false;
      reasons.push('excluded keyword');
    }
    if (!power) {
      wouldPass = false;
      reasons.push('no power');
    }
    if (!hasInclude && brand === 'Other') {
      wouldPass = false;
      reasons.push('no include keyword and unknown brand');
    }

    console.log(`  Would pass filter: ${wouldPass ? 'YES' : 'NO'}`);
    if (!wouldPass) {
      console.log(`    Reasons: ${reasons.join(', ')}`);
    }
    console.log('');
  });
}

debugScraper().catch(console.error);
