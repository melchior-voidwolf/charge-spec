/**
 * Analyze the page structure of chongdiantou.com
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

async function analyzePage() {
  const response = await axios.get('https://www.chongdiantou.com/1746334876530.html');
  const $ = cheerio.load(response.data);

  console.log('=== Page Structure Analysis ===');
  console.log('Title:', $('title').text());

  // Find all potential item containers
  const selectors = ['.article-item', '.post-item', '.review-item', '.list-item', 'article', '.item', '.post', '.entry'];

  for (const sel of selectors) {
    const count = $(sel).length;
    if (count > 0) {
      console.log(`Found ${count} items with selector '${sel}'`);
      const first = $(sel).first();
      const html = first.html() || '';
      console.log('  First item HTML (first 500 chars):', html.substring(0, 500));
      console.log('  First item text:', first.text().trim().substring(0, 200));
    }
  }

  // Try to find all h2, h3 elements with links
  console.log('\n=== All h2/h3 with links ===');
  $('h2 a, h3 a').each((i, el) => {
    console.log(`${i + 1}. ${$(el).text().trim()} -> ${$(el).attr('href')}`);
  });

  // Find all links that contain charger keywords
  console.log('\n=== Links containing charger keywords ===');
  const keywords = ['充电器', '充电头', '适配器', 'charger', 'adapter'];
  let count = 0;
  $('a').each((i, el) => {
    const text = $(el).text().trim();
    const href = $(el).attr('href');
    if (href && text && keywords.some(k => text.toLowerCase().includes(k.toLowerCase()))) {
      console.log(`${++count}. ${text.substring(0, 80)} -> ${href}`);
    }
  });

  // Check main content areas
  console.log('\n=== Main content areas ===');
  const contentSelectors = ['#content', '.content', 'main', '.main', '.container', '.wrapper'];
  for (const sel of contentSelectors) {
    const el = $(sel);
    if (el.length > 0) {
      console.log(`Found '${sel}' with ${el.find('a').length} links inside`);
    }
  }

  // Look for list items
  console.log('\n=== List items ===');
  console.log(`li elements: ${$('li').length}`);
  console.log(`First 5 li text:`);
  $('li').slice(0, 5).each((i, el) => {
    console.log(`  ${i + 1}. ${$(el).text().trim().substring(0, 100)}`);
  });
}

analyzePage().catch(console.error);
