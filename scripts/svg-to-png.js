import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

const svgFiles = [
  'og-aqi-good.svg',
  'og-aqi-moderate.svg',
  'og-aqi-sensitive.svg',
  'og-aqi-unhealthy.svg',
  'og-aqi-very-unhealthy.svg',
  'og-aqi-hazardous.svg'
];

async function convertSVGtoPNG(svgFile) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 }
  });

  // Read SVG
  const svgPath = join(projectRoot, 'public/og', svgFile);
  const svgContent = readFileSync(svgPath, 'utf-8');

  // Create HTML with font imports - SVG already has Satoshi font specified
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://api.fontshare.com/v2/css?f[]=satoshi@700,800&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      background: #1a1d21;
    }
    svg {
      display: block;
      width: 1200px;
      height: 630px;
    }
  </style>
</head>
<body>
  ${svgContent}
</body>
</html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500); // Font load time

  const pngBuffer = await page.screenshot({ type: 'png' });

  const pngFile = svgFile.replace('.svg', '.png');
  const pngPath = join(projectRoot, 'public/og', pngFile);
  writeFileSync(pngPath, pngBuffer);

  console.log(`✓ ${svgFile} → ${pngFile} (${(pngBuffer.length / 1024).toFixed(0)} KB)`);

  await browser.close();
}

async function main() {
  console.log('Rendering OG images with browser...\n');

  for (const svgFile of svgFiles) {
    try {
      await convertSVGtoPNG(svgFile);
    } catch (error) {
      console.error(`✗ Failed ${svgFile}:`, error.message);
    }
  }

  console.log('\nDone!');
}

main();
