const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'dist');
const outDir = path.join(__dirname, '..', 'docs', 'screenshots');
fs.mkdirSync(outDir, { recursive: true });
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff': 'font/woff', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const file = path.join(root, p);
  fs.readFile(file, (err, data) => {
    if (err) { fs.readFile(path.join(root, 'index.html'), (e2, d2) => { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(d2); }); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});

const BASE = 'http://localhost:5203';

async function enter(page) {
  await page.goto(BASE + '/#/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  if (await page.getByText('ENTER PLAYTREE').count()) {
    await page.getByText('ENTER PLAYTREE').first().click();
    await page.getByText('CONTINUE', { exact: false }).first().click({ timeout: 25000 });
    await page.waitForFunction(() => !!document.querySelector('.rail') || !!document.querySelector('.bottom-nav'), null, { timeout: 8000 });
  }
  await page.waitForTimeout(600);
}

async function shot(page, hash, file) {
  await page.goto(BASE + '/#' + hash, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(outDir, file) });
  console.log('shot', file);
}

(async () => {
  await new Promise((r) => server.listen(5203, r));
  const browser = await chromium.launch();

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await enter(desktop);
  await shot(desktop, '/', '03-home.png');
  await shot(desktop, '/games', 'games.png');
  await shot(desktop, '/profile', 'profile.png');
  await shot(desktop, '/store', 'store.png');
  await shot(desktop, '/studio', 'studio.png');
  await shot(desktop, '/leaderboard', 'ranks.png');
  await shot(desktop, '/player/GoStudios', 'player.png');
  await shot(desktop, '/groups/g1', 'group.png');
  await desktop.close();

  const mobile = await browser.newPage({ viewport: { width: 393, height: 852 } });
  await enter(mobile);
  await shot(mobile, '/', 'mobile-home.png');
  await shot(mobile, '/groups/g1', 'mobile-group.png');
  await mobile.close();

  await browser.close();
  server.close();
  console.log('done');
  process.exit(0);
})();
