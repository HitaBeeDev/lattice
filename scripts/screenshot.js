import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

mkdirSync(join(__dirname, '../docs/assets'), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('https://lattice-project.vercel.app/');
await page.waitForTimeout(2500);
await page.screenshot({ path: join(__dirname, '../docs/assets/preview.png'), fullPage: false });
await browser.close();
console.log('Screenshot saved to docs/assets/preview.png');
