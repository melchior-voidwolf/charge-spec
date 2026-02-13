// Simple script to check page loading without Playwright
const https = require('https');
const http = require('http');

function checkUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ url, status: res.statusCode, success: res.statusCode < 400 });
      });
    }).on('error', (err) => {
      resolve({ url, status: 'ERROR', error: err.message, success: false });
    });
  });
}

async function main() {
  const baseUrl = 'https://melchior-voidwolf.github.io/charge-spec';

  const urls = [
    baseUrl,
    `${baseUrl}/chargers`,
    `${baseUrl}/chargers/apple-20w-usb-c`,
    `${baseUrl}/_next/static/css/`,
  ];

  for (const url of urls) {
    const result = await checkUrl(url);
    console.log(`${result.status}: ${result.url}`);
  }
}

main().catch(console.error);
