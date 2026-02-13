/**
 * Try to find category pages for chargers on chongdiantou.com
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

async function findCategories() {
  const response = await axios.get('https://www.chongdiantou.com/1746334876530.html');
  const $ = cheerio.load(response.data);

  console.log('=== Looking for category links ===\n');

  // Find category links in the navigation
  const categoryLinks: Array<{ name: string; url: string }> = [];

  // Look for navigation links
  $('nav a, .nav a, .menu a, .category a').each((i, el) => {
    const text = $(el).text().trim();
    const href = $(el).attr('href');

    // Filter for relevant categories
    if (href && text && (
      text.includes('充') ||
      text.includes('器') ||
      text.includes('拆解') ||
      text.includes('评测')
    )) {
      categoryLinks.push({
        name: text,
        url: href.startsWith('http') ? href : `https://www.chongdiantou.com${href}`,
      });
    }
  });

  console.log('Found relevant links:');
  categoryLinks.forEach((link, i) => {
    console.log(`  ${i + 1}. ${link.name} -> ${link.url}`);
  });

  // Try some common category URL patterns
  const commonPatterns = [
    'https://www.chongdiantou.com/category/reviews',
    'https://www.chongdiantou.com/category/charger',
    'https://www.chongdiantou.com/category/teardown',
    'https://www.chongdiantou.com/archives/category/charger',
    'https://www.chongdiantou.com/archives/category/reviews',
  ];

  console.log('\n=== Testing common URL patterns ===\n');

  for (const url of commonPatterns) {
    try {
      console.log(`Trying: ${url}`);
      const testResponse = await axios.get(url, { timeout: 10000 });
      const $test = cheerio.load(testResponse.data);
      const title = $test('title').text();
      const items = $test('.list-item, article, .post').length;

      console.log(`  -> Found! Title: "${title}", Items: ${items}`);
    } catch (error) {
      console.log(`  -> Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Check the main page for more listing patterns
  console.log('\n=== Checking page structure for infinite scroll / load more ===\n');

  // Look for load more buttons
  const loadMoreButtons: Array<{ tag: string; text: string; onclick: string; dataAttrs: string }> = [];
  $('button:contains("加载"), button:contains("更多"), a:contains("下一页"), .load-more, .next-page').each((i, el) => {
    const text = $(el).text().trim();
    const onclick = $(el).attr('onclick') || '';
    const dataAttrs = Object.keys(el.attribs || {})
      .filter(k => k.startsWith('data-'))
      .map(k => `${k}="${el.attribs[k]}"`)
      .join(' ');

    if (text || onclick || dataAttrs) {
      loadMoreButtons.push({
        tag: el.tagName,
        text,
        onclick,
        dataAttrs,
      });
    }
  });

  console.log('Load more / pagination buttons found:');
  if (loadMoreButtons.length > 0) {
    loadMoreButtons.forEach((btn, i) => {
      console.log(`  ${i + 1}. <${btn.tag}> ${btn.text}`);
      if (btn.onclick) console.log(`     onclick: ${btn.onclick}`);
      if (btn.dataAttrs) console.log(`     ${btn.dataAttrs}`);
    });
  } else {
    console.log('  None found');
  }
}

findCategories().catch(console.error);
