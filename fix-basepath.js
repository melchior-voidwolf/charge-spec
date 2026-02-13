// Post-build script to fix static asset paths for GitHub Pages deployment
const fs = require('fs');
const path = require('path');

const BASE_PATH = '/charge-spec';
const outDir = path.join(__dirname, 'packages', 'web', 'out');

// Fix favicon and icon paths in HTML files
function fixHtmlFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      fixHtmlFiles(fullPath);
    } else if (file.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');

      // Fix favicon paths
      content = content.replace(
        /href="\/(favicon\.svg|apple-touch-icon\.png|icon-\d+\.png|icon-\d+\.svg)"/g,
        `href="${BASE_PATH}/$1"`
      );

      // Fix any other static asset paths that might be missing basePath
      content = content.replace(
        /href="\/(logo\.svg)"/g,
        `href="${BASE_PATH}/$1"`
      );

      fs.writeFileSync(fullPath, content);
      console.log(`Fixed: ${fullPath}`);
    }
  }
}

// Also copy favicon files to the basePath subdirectory
function copyStaticAssets() {
  const basePathDir = path.join(outDir, BASE_PATH);
  if (!fs.existsSync(basePathDir)) {
    fs.mkdirSync(basePathDir, { recursive: true });
  }

  const staticFiles = [
    'favicon.svg',
    'apple-touch-icon.png',
    'logo.svg',
    'icon-16.png',
    'icon-32.png',
    'icon-180.svg',
    'icon-192.png',
    'icon-192.svg',
    'icon-512.png',
    'icon-512.svg',
  ];

  for (const file of staticFiles) {
    const src = path.join(outDir, file);
    if (fs.existsSync(src)) {
      const dest = path.join(basePathDir, file);
      fs.copyFileSync(src, dest);
      console.log(`Copied: ${file} to ${BASE_PATH}/`);
    }
  }
}

console.log('Fixing basePath in HTML files...');
fixHtmlFiles(outDir);

console.log('\nCopying static assets to basePath directory...');
copyStaticAssets();

console.log('\nDone! basePath fixes applied.');
