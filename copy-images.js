import fs from 'fs';
import path from 'path';

console.log('--- Scanning Filesystem ---');

function scanDir(dir, maxDepth, currentDepth = 0) {
  if (currentDepth > maxDepth) return;
  try {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      if (item.startsWith('.')) continue;
      const full = path.join(dir, item);
      let stat;
      try { stat = fs.statSync(full); } catch (e) { continue; }
      if (stat.isDirectory()) {
        scanDir(full, maxDepth, currentDepth + 1);
      } else if (item.endsWith('.png') || item.includes('input_file') || item.includes('file')) {
        console.log(`[FILE] ${full} (${stat.size} bytes)`);
      }
    }
  } catch (e) {}
}

console.log('Scanning current directory...');
scanDir(process.cwd(), 3);

console.log('Scanning / folder...');
scanDir('/', 1);

console.log('--- Scan Finished ---');
process.exit(0);
