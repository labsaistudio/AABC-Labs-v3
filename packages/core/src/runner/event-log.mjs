import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export async function appendEvent(filePath, event) {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(event)}\n`, { flag: 'a' });
}

export async function readEvents(filePath) {
  const raw = await readFile(filePath, 'utf8');
  return raw.trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));
}
