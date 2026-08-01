#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const outDir = resolve(root, 'out');

if (!existsSync(outDir)) {
  console.error('Missing out/ directory. Run the static export first.');
  process.exit(1);
}

try {
  const configs = [
    'lighthouserc.desktop.json',
    'lighthouserc.mobile.json',
  ];

  for (const cfg of configs) {
    console.log(`\nRunning Lighthouse using ${cfg}...`);
    execSync(`npx -y @lhci/cli@0.13.x collect --config=${cfg}`, { stdio: 'inherit' });
    execSync(`npx -y @lhci/cli@0.13.x assert --config=${cfg}`, { stdio: 'inherit' });
    execSync(`npx -y @lhci/cli@0.13.x upload --config=${cfg}`, { stdio: 'inherit' });
  }

  console.log('\nLighthouse checks completed. Reports in lighthouse/reports/{desktop,mobile}');
} catch (e) {
  console.error('\nLighthouse checks failed (see output above). Reports may still be generated in lighthouse/reports.');
  process.exit(1);
}
