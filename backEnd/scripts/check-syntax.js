// Syntax-checks every backend source file: `npm run check`
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : path.endsWith('.js') ? [path] : [];
  });

for (const file of walk('src'))
  execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
console.log('All files passed the syntax check.');
