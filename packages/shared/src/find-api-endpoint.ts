/**
 * Try to find the API endpoint for loading more articles
 */

import axios from 'axios';

async function findApiEndpoint() {
  console.log('=== Trying common API patterns ===\n');

  // Common API patterns for this type of site
  const apiPatterns = [
    // Category-based API
    'https://www.chongdiantou.com/api/category/3463?page=2',
    'https://www.chongdiantou.com/api/list?category=3463&page=2',
    'https://www.chongdiantou.com/api/posts?category=3463&page=2',
    'https://www.chongdiantou.com/api/reviews?page=2',

    // Archive patterns
    'https://www.chongdiantou.com/archives/category/reviews?page=2',
    'https://www.chongdiantou.com/archives/category/charger?page=2',
    'https://www.chongdiantou.com/category/3463?page=2',

    // JSON API
    'https://www.chongdiantou.com/api/list/3463/2',
    'https://api.chongdiantou.com/list?cat=3463&page=2',
  ];

  const workingUrls: Array<{ url: string; itemCount: number }> = [];

  for (const url of apiPatterns) {
    try {
      console.log(`Trying: ${url}`);
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json, text/plain, */*',
        },
      });

      const contentType = response.headers['content-type'] || '';

      // Check if response looks like JSON or HTML
      let itemCount = 0;
      if (contentType.includes('json')) {
        const data = response.data;
        if (Array.isArray(data)) {
          itemCount = data.length;
        } else if (typeof data === 'object' && data !== null) {
          itemCount = Object.keys(data).length;
          // Try to find list in the response
          if (data.list) {
            itemCount = Array.isArray(data.list) ? data.list.length : 0;
          } else if (data.data) {
            itemCount = Array.isArray(data.data) ? data.data.length : 0;
          }
        }
        console.log(`  -> JSON response! Items: ${itemCount}`);
      } else {
        // HTML response - check for list-item elements
        const match = response.data.match(/class="list-item"/g);
        itemCount = match ? match.length : 0;
        console.log(`  -> HTML response! Found ${itemCount} list-item elements`);
      }

      // Only count if different from the first page
      if (itemCount > 0 && itemCount !== 15) {
        workingUrls.push({ url, itemCount });
      }

    } catch (error) {
      const status = (error as any).response?.status;
      const message = (error as any).response?.data ? 'got data' : (error as Error).message;
      console.log(`  -> Failed (${status}): ${message}`);
    }

    console.log('');
  }

  console.log('\n=== Summary ===');
  console.log('Working URLs:');
  if (workingUrls.length > 0) {
    workingUrls.forEach((u, i) => {
      console.log(`  ${i + 1}. ${u.url} (${u.itemCount} items)`);
    });
  } else {
    console.log('  None found');
    console.log('\nNote: This site likely uses client-side rendering with JS-based pagination.');
    console.log('You may need to use a headless browser (Puppeteer/Playwright) to load more data.');
  }
}

findApiEndpoint().catch(console.error);
