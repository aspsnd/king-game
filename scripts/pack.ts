import { packAsync } from "free-tex-packer-core";
import { readdir, readFile, rm, stat, mkdir, writeFile, copyFile, appendFile } from "fs/promises";
import { relative, resolve } from "path";

const listFile = './src/ts/resources/list.ts';

const outDir = './public/packed-resources';

const getImgs = async (dirname: string) => {
  const files = await readdir(dirname);
  const imgs = [];

  for (const file of files) {
    if (file.startsWith('re') || file.startsWith('_')) continue;
    const path = resolve(dirname, file);
    const s = await stat(path);
    if (s.isFile() && file.endsWith('.jpg') || file.endsWith('.png')) {
      imgs.push(path);
    } else if (s.isDirectory()) {
      imgs.push(...await getImgs(path));
    }
  }

  return imgs;
}

const packPackage = async (srcs: string[]) => {
  const params = [];
  for (const src of srcs) {
    params.push({
      path: relative('./public/resources', src),
      contents: await readFile(src)
    })
  };
  const results = await packAsync(params, {
    width: 1024,
    height: 1024,
    exporter: 'Pixi' as any
  })
  const map = new Map<string, Buffer[]>();
  for (const result of results) {
    const [name, ext] = result.name.split('.');
    if (!map.has(name)) {
      map.set(name, []);
    };

    map.get(name)[ext === 'png' ? 0 : 1] = result.buffer;
  }

  const res: string[] = [];
  for (const [b1, b2] of map.values()) {
    count++;
    res.push(count + '');
    const json = JSON.parse(b2.toString('utf8'));
    json.meta.image = `${count}.png`;
    writeFile(resolve(outDir, `${count}.png`), b1);
    writeFile(resolve(outDir, `${count}.json`), JSON.stringify(json, undefined, 2));
  }

  return res;

}

let count = 0;

const run = async () => {

  try {
    await rm(outDir, {
      recursive: true
    });
  } catch { };

  await mkdir(outDir);

  try {
    const statics = await getImgs('./public/resources/static');
    const res = await packPackage(statics);
    const data1 = `export const statics = ${JSON.stringify(res, undefined, 2)};\r\n`;

    await writeFile(listFile, data1);
  } catch (e) {
    console.error(e)
  }

  await runAsserts();

}

const runAsserts = async () => {
  const backDir = './public/resources/assets/scene/back';
  const map = {};
  for (const file of await readdir(backDir)) {
    if (file.endsWith('.jpg') || file.endsWith('.png')) {
      const ext = file.split('.').pop();
      const path = resolve(backDir, file);
      const key = relative('./public/resources', path).replace(/\\/g, '/');
      const index = ++count;
      await copyFile(path, resolve(outDir, `${index}.${ext}`));
      map[key] = `${index}.${ext}`;
    }
  }
  const data2 = `export const backs: Record<string, string> = ${JSON.stringify(map, undefined, 2)};\r\n`;
  await appendFile(listFile, data2);

  const groundDir = './public/resources/assets/scene/ground';

  const groundMap = {};
  for (const file of await readdir(groundDir)) {
    if (file.endsWith('.jpg') || file.endsWith('.png')) {
      const ext = file.split('.').pop();
      const path = resolve(groundDir, file);
      const key = relative('./public/resources', path).replace(/\\/g, '/');
      const index = ++count;
      await copyFile(path, resolve(outDir, `${index}.${ext}`));
      groundMap[key] = `${index}.${ext}`;
    }
  }
  const data3 = `export const grounds: Record<string, string> = ${JSON.stringify(groundMap, undefined, 2)};\r\n`;
  await appendFile(listFile, data3);

}

run();