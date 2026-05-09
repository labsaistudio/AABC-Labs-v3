import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { scanCommand } from '../cli/src/commands/scan.mjs';

test('public boundary scan rejects exposed credential markers', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'aabc-scan-bad-'));
  try {
    await writeFile(join(dir, 'README.md'), `${['SERVICE', 'API', 'KEY'].join('_')}=x`);
    await assert.rejects(() => scanCommand([dir]), /public boundary scan failed/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('public boundary scan accepts exact redaction metadata files', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'aabc-scan-good-'));
  try {
    await mkdir(join(dir, 'packages/proof/src'), { recursive: true });
    await mkdir(join(dir, 'tests'), { recursive: true });
    await writeFile(join(dir, 'packages/proof/src/forbidden-fields.mjs'), [
      ['private', 'key'].join('_'),
      ['api', 'key'].join('_'),
      ['mnemo', 'nic'].join(''),
    ].join('\n'));
    await writeFile(join(dir, 'tests/proof-redaction.test.mjs'), ['private', 'key'].join('_'));
    await scanCommand([dir]);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
