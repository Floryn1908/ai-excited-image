// ai-excited-01 entry: copies the image beside this file to the output directory.
// The judge sees exactly the bytes copied, so this program only moves the file and
// refuses to write anything over the 1 MiB gate limit.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const dest = join(outDir, 'entry.png');

if (!existsSync(source)) {
  throw new Error(`entry.png not found next to main.ts (${source})`);
}
mkdirSync(outDir, { recursive: true });
copyFileSync(source, dest);
if (!existsSync(dest)) {
  throw new Error(`copy failed: ${dest} was not written`);
}
const bytes = statSync(dest).size;
if (bytes > 1024 * 1024) {
  throw new Error(`entry.png is ${bytes} bytes, over the 1 MiB gate limit`);
}
console.log(`copied ${source} -> ${dest} (${bytes} bytes)`);
