const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const propsPath = path.join(root, 'build', 'keystore.properties');

if (!fs.existsSync(propsPath)) {
  console.error('build/keystore.properties not found - cannot sign. Run unsigned with: npx electron-builder --win');
  process.exit(1);
}

const props = Object.fromEntries(
  fs.readFileSync(propsPath, 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

if (!fs.existsSync(props.codesignFile)) {
  console.error('codesignFile missing: ' + props.codesignFile);
  process.exit(1);
}

const env = {
  ...process.env,
  CSC_LINK: props.codesignFile,
  CSC_KEY_PASSWORD: props.codesignPassword,
};

const r = spawnSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['electron-builder', '--win', ...process.argv.slice(2)],
  { cwd: root, env, stdio: 'inherit', shell: true }
);
process.exit(r.status === null ? 1 : r.status);
