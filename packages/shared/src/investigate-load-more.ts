/**
 * Investigate the "Load More" button and find the API endpoint
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

async function investigateLoadMore() {
  const response = await axios.get('https://www.chongdiantou.com/1746334876530.html');
  const $ = cheerio.load(response.data);

  console.log('=== Investigating Load More Button ===\n');

  // Find the load more button
  const loadMoreBtn = $('button:contains("加载更多"), .load-more, button[class*="load"]').first();

  if (loadMoreBtn.length > 0) {
    console.log('Found load more button:');
    console.log(`  Tag: ${loadMoreBtn[0].tagName}`);
    console.log(`  Text: "${loadMoreBtn.text().trim()}"`);
    console.log(`  Class: "${loadMoreBtn.attr('class')}"`);
    console.log(`  ID: "${loadMoreBtn.attr('id')}"`);

    // Check all attributes
    console.log('\nAll attributes:');
    Object.keys(loadMoreBtn[0].attribs || {}).forEach(key => {
      const value = loadMoreBtn.attr(key);
      console.log(`  ${key}: "${value}"`);
    });

    // Look for nearby script tags that might contain the API logic
    console.log('\n=== Looking for JavaScript with load/next/page ===\n');

    let scriptIndex = 0;
    $('script').each((i, el) => {
      const scriptContent = $(el).html() || '';
      if (scriptContent &&
          (scriptContent.includes('load') ||
           scriptContent.includes('next') ||
           scriptContent.includes('page') ||
           scriptContent.includes('ajax') ||
           scriptContent.includes('fetch') ||
           scriptContent.includes('api'))) {
        const snippet = scriptContent.substring(0, 300);
        console.log(`Script ${++scriptIndex} (first 300 chars):\n${snippet}\n---`);
      }
    });
  } else {
    console.log('Load more button not found');
  }

  // Check for any data-* attributes on common containers
  console.log('\n=== Looking for data attributes on containers ===\n');

  $('#content, main, .container, .list').each((i, el) => {
    const id = $(el).attr('id') || $(el).attr('class') || `element-${i}`;
    const dataAttrs = Object.keys(el.attribs || {})
      .filter(k => k.startsWith('data-'))
      .map(k => `  ${k}: "${el.attribs[k]}"`);

    if (dataAttrs.length > 0) {
      console.log(`${id}:`);
      dataAttrs.forEach(attr => console.log(attr));
    }
  });

  // Check for Next.js data (common in modern sites)
  console.log('\n=== Looking for Next.js data ===\n');
  const hasNextData = $('script#__NEXT_DATA__').length > 0;
  const hasNextId = $('script#__NEXT_ID__').length > 0;

  console.log(`Has __NEXT_DATA__: ${hasNextData}`);
  console.log(`Has __NEXT_ID__: ${hasNextId}`);

  if (hasNextData) {
    const data = $('script#__NEXT_DATA__').html();
    console.log('\n__NEXT_DATA__ content (first 500 chars):');
    console.log(data?.substring(0, 500));
  }
}

investigateLoadMore().catch(console.error);
