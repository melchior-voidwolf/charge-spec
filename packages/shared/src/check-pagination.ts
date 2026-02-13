/**
 * Check pagination structure of chongdiantou.com
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

async function checkPagination() {
  const page1 = await axios.get('https://www.chongdiantou.com/1746334876530.html');
  const $1 = cheerio.load(page1.data);

  const page2 = await axios.get('https://www.chongdiantou.com/1746334876530.html?page=2');
  const $2 = cheerio.load(page2.data);

  console.log('=== Page 1 vs Page 2 Comparison ===\n');

  const items1 = $1('.list-item');
  const items2 = $2('.list-item');

  console.log(`Page 1 items: ${items1.length}`);
  console.log(`Page 2 items: ${items2.length}\n`);

  console.log('Page 1 first 3 titles:');
  items1.slice(0, 3).each((i, el) => {
    console.log(`  ${i + 1}. ${$1(el).find('.list-title a').first().text().trim()}`);
  });

  console.log('\nPage 2 first 3 titles:');
  items2.slice(0, 3).each((i, el) => {
    console.log(`  ${i + 1}. ${$2(el).find('.list-title a').first().text().trim()}`);
  });

  // Check for pagination elements
  console.log('\n=== Pagination Elements ===');
  console.log('Page 1 pagination:');
  $1('.pagination, .pager, .page-nav, .load-more, [class*="page"], [class*="nav"]').each((i, el) => {
    console.log(`  Found: ${$1(el).attr('class') || $1(el).prop('tagName')} - ${$1(el).text().trim()}`);
  });

  console.log('\nPage 2 pagination:');
  $2('.pagination, .pager, .page-nav, .load-more, [class*="page"], [class*="nav"]').each((i, el) => {
    console.log(`  Found: ${$2(el).attr('class') || $2(el).prop('tagName')} - ${$2(el).text().trim()}`);
  });

  // Check if content is actually different
  const html1 = page1.data.substring(page1.data.indexOf('<div class="list-item'), page1.data.indexOf('<div class="list-item') + 500);
  const html2 = page2.data.substring(page2.data.indexOf('<div class="list-item'), page2.data.indexOf('<div class="list-item') + 500);
  console.log('\n=== HTML Comparison (first 500 chars of first item) ===');
  console.log('Page 1:', html1.substring(0, 200));
  console.log('Page 2:', html2.substring(0, 200));
  console.log('Are they the same?', html1 === html2);
}

checkPagination().catch(console.error);
