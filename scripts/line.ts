import { readdir, readFile, stat } from "fs/promises";
import { resolve } from "path";

let fileNum = 0;
let lineNum = 0;

const run = async (dir: string) => {
  const files = await readdir(dir);
  for (const file of files) {
    const path = resolve(dir, file);
    const s = await stat(path);
    if (s.isFile() && file.endsWith('.ts')) {
      fileNum++;
      const content = await readFile(path, 'utf-8');
      const line = content.split('\n').length - 1;
      lineNum += line;
    } else if (s.isDirectory()) {
      await run(path);
    }
  }
};

(async () => {
  await run('./src');
  console.log(`ts files count: ${fileNum}`);
  console.log(`lines count: ${lineNum}`);
})();
