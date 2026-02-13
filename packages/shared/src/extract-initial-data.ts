/**
 * Extract and parse window.__INITIAL_DATA__ to find API patterns
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

async function extractInitialData() {
  const response = await axios.get('https://www.chongdiantou.com/1746334876530.html');
  const $ = cheerio.load(response.data);

  console.log('=== Extracting __INITIAL_DATA__ ===\n');

  // Find the script with __INITIAL_DATA__
  const scriptContent = $('script').filter((i, el) => {
    const html = $(el).html() || '';
    return html.includes('__INITIAL_DATA__');
  }).html();

  if (!scriptContent) {
    console.log('__INITIAL_DATA__ not found');
    return;
  }

  // Extract the JSON
  const match = scriptContent.match(/window\.__INITIAL_DATA__\s*=\s*({.*?});?\s*$/s);
  if (!match) {
    console.log('Could not extract JSON from __INITIAL_DATA__');
    console.log('\nScript content (first 1000 chars):');
    console.log(scriptContent.substring(0, 1000));
    return;
  }

  try {
    const data = JSON.parse(match[1]);
    console.log('Successfully parsed __INITIAL_DATA__\n');

    // Print the structure
    console.log('Top-level keys:', Object.keys(data));

    // Look for API endpoints, lists, or data arrays
    const findArrays = (obj: any, path = 'root', depth = 0) => {
      if (depth > 5) return;

      if (Array.isArray(obj)) {
        console.log(`Array found at ${path}, length: ${obj.length}`);
        if (obj.length > 0 && typeof obj[0] === 'object') {
          console.log(`  First item keys: ${Object.keys(obj[0]).join(', ')}`);
          if (obj[0].title) {
            console.log(`  Sample title: ${obj[0].title?.substring(0, 80)}`);
          }
        }
      } else if (typeof obj === 'object' && obj !== null) {
        for (const key of Object.keys(obj)) {
          // Look for API-related keys
          if (key.toLowerCase().includes('api') ||
              key.toLowerCase().includes('url') ||
              key.toLowerCase().includes('endpoint') ||
              key.toLowerCase().includes('list') ||
              key.toLowerCase().includes('data')) {
            console.log(`Found interesting key: ${path}.${key}`);
          }
          findArrays(obj[key], `${path}.${key}`, depth + 1);
        }
      }
    };

    findArrays(data);

    // Pretty print the whole structure for inspection
    console.log('\n=== Full structure (first 2000 chars of JSON) ===');
    console.log(JSON.stringify(data, null, 2).substring(0, 2000));

    // Save to file for manual inspection
    const fs = await import('fs/promises');
    await fs.writeFile('./initial-data.json', JSON.stringify(data, null, 2));
    console.log('\nSaved to initial-data.json');

  } catch (error) {
    console.error('Failed to parse JSON:', error);
  }
}

extractInitialData().catch(console.error);
