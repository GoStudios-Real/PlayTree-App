const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'dist');
const outDir = path.join(__dirname, 'results');
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

const results = [];
const errors = [];
const check = (name, ok, extra) => { results.push({ name, ok, extra }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  [' + extra + ']' : ''}`); };
const step = async (name, fn) => { try { await fn(); } catch (e) { check(name, false, e.message.split('\n')[0].slice(0, 140)); } };

(async () => {
  await new Promise((r) => server.listen(5201, r));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(8000);
  page.setDefaultNavigationTimeout(15000);
  const watchdog = setTimeout(() => { console.log('WATCHDOG: overall timeout, exiting'); process.exit(2); }, 360000);
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text().slice(0, 200)); });
  const toast = () => page.locator('.toast').textContent().catch(() => null);
  const waitToast = async (s, ms = 4000) => {
    try {
      await page.waitForFunction((needle) => { const el = document.querySelector('.toast'); return !!el && el.textContent.includes(needle); }, s, { timeout: ms });
      return await toast();
    } catch { return null; }
  };
  const tp = async () => { const t = await page.locator('.topnav .mono-label').first().textContent().catch(() => ''); return parseInt(t, 10); };

  // 1. gate
  await step('gate loads', async () => {
    await page.goto('http://localhost:5201/#/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    if (!(await page.getByText('ENTER PLAYTREE').count())) throw new Error('no ENTER PLAYTREE button');
    await page.getByText('ENTER PLAYTREE').first().click();
    const c = page.getByText('CONTINUE', { exact: false }).first();
    await c.click({ timeout: 25000 });
    await page.waitForSelector('.rail', { timeout: 8000 });
    check('gate -> app (rail visible)', true);
  });

  // 2. daily claim
  await step('daily claim', async () => {
    const before = await tp();
    await page.getByText('CLAIM +100 TP').first().click();
    const t = await waitToast('TREE-POINTS CLAIMED');
    check('claim toast', !!t, t);
    const after = await tp();
    check('points 500 -> 600', before === 500 && after === 600, `${before} -> ${after}`);
    const claimed = await page.getByText('CLAIMED ✓').count();
    check('button shows CLAIMED', claimed > 0);
  });

  // 3. hero game modal
  await step('play main game', async () => {
    await page.getByText('PLAY MAIN GAME').first().click();
    await page.waitForSelector('.overlay .modal', { timeout: 5000 });
    await page.locator('.modal button:has-text("PLAY NOW")').click();
    await page.waitForTimeout(600);
    const hasCanvas = await page.locator('.game-stage canvas').count();
    check('game stage canvas starts', hasCanvas > 0, `canvas=${hasCanvas}`);
    await page.locator('.modal-head .icon-btn').first().click();
    await page.waitForSelector('.overlay', { state: 'detached', timeout: 4000 }).catch(() => {});
    check('game modal closes', (await page.locator('.overlay').count()) === 0);
  });

  // 4. rail navigation across all sections
  const railRoutes = [['PROFILE', '#/profile'], ['FRIENDS', '#/friends'], ['GROUPS', '#/groups'], ['GAMES', '#/games'], ['LOCKER', '#/locker'], ['STORE', '#/store'], ['VIDEOS', '#/videos'], ['RANKS', '#/leaderboard'], ['REALITY', '#/reality'], ['MOD', '#/moderation'], ['SUPPORT', '#/support'], ['HOME', '#/']];
  await step('rail navigation', async () => {
    let ok = 0, fails = [];
    for (const [label, hash] of railRoutes) {
      await page.locator('.rail').getByText(label, { exact: true }).first().click();
      try {
        await page.waitForFunction((h) => location.hash === h, hash, { timeout: 4000 });
        ok++;
      } catch {
        const cur = await page.evaluate(() => location.hash);
        fails.push(label + '->' + cur);
      }
      await page.waitForTimeout(150);
    }
    check('rail: all 12 sections navigate', ok === railRoutes.length, fails.join(','));
  });

  // 5. games: search, install, play
  await step('games library', async () => {
    await page.goto('http://localhost:5201/#/games', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    await page.getByText('INSTALL ALL').first().click();
    check('install all toast', !!(await waitToast('ALL GAMES INSTALLED')));
    await page.locator('input[placeholder="Search games..."]').fill('moo');
    await page.waitForTimeout(300);
    const cards = await page.getByText('MOO', { exact: true }).count();
    check('search filters to MOO', cards >= 1, `matches=${cards}`);
    await page.locator('input[placeholder="Search games..."]').fill('');
    await page.waitForTimeout(300);
    await page.getByText('PLAY NOW').first().click();
    await page.waitForSelector('.overlay .modal', { timeout: 5000 });
    check('featured game opens', true);
    await page.locator('.modal-head .icon-btn').first().click();
    await page.waitForSelector('.overlay', { state: 'detached', timeout: 4000 }).catch(() => {});
  });

  // 6. redeem code
  await step('redeem code', async () => {
    await page.goto('http://localhost:5201/#/redeem', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    await page.locator('input[placeholder="ENTER CODE"]').fill('GOCONSOLE100');
    await page.getByRole('button', { name: 'REDEEM', exact: true }).click();
    const t = await waitToast('+100');
    check('redeem GOCONSOLE100 +100', !!t, t);
    check('points now 700', (await tp()) === 700, String(await tp()));
  });

  // 7. studio: test play, undo, publish
  await step('studio editor', async () => {
    await page.goto('http://localhost:5201/#/studio', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    await page.getByText('↩ UNDO').first().click();
    check('undo on empty level warns', !!(await waitToast('NOTHING TO UNDO')));
    await page.waitForSelector('.toast', { state: 'detached', timeout: 6000 }).catch(() => {});
    await page.getByText('▶ TEST PLAY').first().click();
    await page.waitForTimeout(400);
    check('test play toggles to STOP', (await page.getByText('■ STOP').count()) > 0);
    await page.getByText('■ STOP').first().click();
    await page.waitForTimeout(300);
    // locate the editor canvas, click cell (6,4)
    const gridBox = await page.evaluate(() => {
      const panels = [...document.querySelectorAll('.panel')];
      const panel = panels.find((p) => p.textContent.includes('2D LEVEL EDITOR'));
      const cv = panel && panel.querySelector('canvas');
      if (!cv) return null;
      const r = cv.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    });
    check('editor grid found', !!gridBox, JSON.stringify(gridBox));
    if (gridBox) {
      await page.mouse.click(gridBox.x + gridBox.w * (6.5 / 24), gridBox.y + gridBox.h * (4.5 / 14));
      await page.waitForTimeout(250);
      await page.getByText('↩ UNDO').first().click();
      await page.waitForTimeout(250);
      const t2 = await toast();
      check('tile painted (undo had history)', t2 !== 'NOTHING TO UNDO', String(t2));
      await page.waitForSelector('.toast', { state: 'detached', timeout: 6000 }).catch(() => {});
    }
    await page.getByText('PUBLISH GAME').first().click();
    const t = await waitToast('GAME PUBLISHED');
    check('publish game (250 TP)', !!t, t);
    await page.waitForTimeout(600);
    check('points now 450', (await tp()) === 450, String(await tp()));
    check('published -> games library', (await page.evaluate(() => location.hash)) === '#/games');
    const inLib = await page.getByText(/MY AWESOME GAME/i).count();
    check('published game in library', inLib > 0, `matches=${inLib}`);
  });

  // 8. store: fail + success purchase
  await step('store purchases', async () => {
    await page.goto('http://localhost:5201/#/store', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    const buys = page.getByRole('button', { name: /BUY/ });
    const n = await buys.count();
    check('store has buy buttons', n >= 6, `count=${n}`);
    // Crown Royalty = 800 TP, we have 450 -> should fail
    const crown = page.getByRole('button', { name: /BUY/ }).filter({ has: page.locator('svg') });
    // buy by locating the card containing the item name instead
    const crownBtn = page.locator('button:has-text("BUY")').nth(3);
    await crownBtn.click();
    check('purchase fails when short', !!(await waitToast('NOT ENOUGH TREE-POINTS')));
    const lionBtn = page.locator('button:has-text("BUY")').nth(0);
    await lionBtn.click();
    const t = await waitToast('PURCHASED');
    check('purchase Lion Lord (400 TP)', !!t, t);
    await page.waitForTimeout(300);
    check('points now 50', (await tp()) === 50, String(await tp()));
    const equip = await page.getByRole('button', { name: 'EQUIPPED', exact: true }).count();
    check('purchased item auto-equips (EQUIPPED)', equip > 0, `count=${equip}`);
  });

  // 9. locker equip
  await step('locker equip', async () => {
    await page.goto('http://localhost:5201/#/locker', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    const equipped = await page.getByText('EQUIPPED').count();
    check('locker shows equipped items', equipped > 0, `count=${equipped}`);
  });

  // 10. friends
  await step('friends add', async () => {
    await page.goto('http://localhost:5201/#/friends', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    const input = page.locator('input[placeholder="Enter username..."]').first();
    await input.fill('GoAI_Companion');
    await input.press('Enter');
    check('friend added toast', !!(await waitToast('FRIEND ADDED')));
  });

  // 11. chat
  await step('chat message', async () => {
    await page.goto('http://localhost:5201/#/chat', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    const input = page.locator('input[placeholder="Type a message..."]');
    await input.fill('playtree e2e works');
    await input.press('Enter');
    await page.waitForTimeout(300);
    check('chat message appears', (await page.getByText('playtree e2e works').count()) > 0);
  });

  // 12. battle bus -> lobby
  await step('battle bus deploy', async () => {
    await page.goto('http://localhost:5201/#/battle-bus', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    const zone = page.locator('.panel', { hasText: 'PLAYERS LANDING' }).first();
    await zone.click();
    await page.waitForTimeout(300);
    const deploy = page.locator('button:has-text("DEPLOY"), button:has-text("DROP")').first();
    await deploy.click();
    const t = await waitToast('DROPPING INTO');
    check('deploy toast', !!t, t);
    await page.waitForTimeout(500);
    check('deploy -> lobby', (await page.evaluate(() => location.hash)) === '#/lobby', await page.evaluate(() => location.hash));
  });

  // 13. lobby create party
  await step('lobby party', async () => {
    await page.waitForTimeout(400);
    await page.locator('button:has-text("CREATE PARTY")').first().click(); // tab pill
    await page.waitForTimeout(300);
    await page.locator('.panel button:has-text("CREATE PARTY")').first().click(); // actual action
    const t = await waitToast('PARTY CREATED');
    check('create party toast', !!t, t);
  });

  // 14. persistence across reload
  await step('session persistence', async () => {
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    check('no gate after reload', (await page.locator('.rail').count()) > 0 && (await page.getByText('ENTER PLAYTREE').count()) === 0);
    check('points persist (50)', (await tp()) === 50, String(await tp()));
  });

  // 15. settings toggle
  await step('settings', async () => {
    await page.goto('http://localhost:5201/#/settings', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    check('settings renders toggles', (await page.locator('button, .pill').count()) > 5);
  });

  // 16. mobile flow
  await step('mobile bottom nav', async () => {
    const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await m.goto('http://localhost:5201/#/', { waitUntil: 'networkidle' });
    await m.waitForTimeout(1200);
    await m.getByText('ENTER PLAYTREE').first().click();
    await m.getByText('CONTINUE', { exact: false }).first().click({ timeout: 25000 });
    await m.waitForSelector('.bottom-nav', { timeout: 8000 });
    check('mobile: gate -> home with bottom nav', true);
    await m.locator('.bottom-nav').getByText('GAMES', { exact: true }).first().click();
    await m.waitForTimeout(600);
    check('mobile: bottom nav -> games', (await m.evaluate(() => location.hash)) === '#/games');
    await m.screenshot({ path: path.join(outDir, 'e2e-mobile-games.png') });
    await m.close();
  });

  await page.screenshot({ path: path.join(outDir, 'e2e-final.png') });

  const passed = results.filter((r) => r.ok).length;
  console.log(`\n===== ${passed}/${results.length} checks passed, ${errors.length} console/page errors =====`);
  results.filter((r) => !r.ok).forEach((r) => console.log('FAILED:', r.name, r.extra || ''));
  errors.slice(0, 20).forEach((e) => console.log('ERR:', e));

  await browser.close();
  server.close();
  process.exit(0);
})();
