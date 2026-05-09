import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';

const BLOCKED = [
  { key: 'cjk_text', pattern: /[\u4e00-\u9fff]/ },
  marker('upstream_a', ['Su', 'na'], ''),
  marker('upstream_b', ['Kor', 'tix'], ''),
  marker('credential_a', ['PRIVATE', 'KEY']),
  marker('credential_b', ['BEGIN PRIVATE', 'KEY'], ' '),
  marker('credential_c', ['API', 'KEY']),
  marker('credential_d', ['SECRET', 'KEY']),
  marker('credential_e', ['mnemo', 'nic'], ''),
  marker('credential_f', ['SUPABASE', 'SERVICE', 'ROLE', 'KEY']),
  marker('credential_g', ['OPENAI', 'API', 'KEY']),
  marker('credential_h', ['ANTHROPIC', 'API', 'KEY']),
];

const SKIP_DIRS = new Set(['.git', 'node_modules', '.outcome']);
const ALLOWED_SCAN_HITS = new Map([
  ['packages/proof/src/forbidden-fields.mjs', new Set([
    'credential_a',
    'credential_c',
    'credential_e',
  ])],
  ['tests/proof-redaction.test.mjs', new Set(['credential_a'])],
]);

export async function scanCommand(args) {
  const root = resolve(args[0] || '.');
  const hits = [];
  await walk(root, async (filePath) => {
    const raw = await readFile(filePath, 'utf8').catch(() => '');
    const scanPath = relative(root, filePath).split(sep).join('/');
    for (const rule of BLOCKED) {
      if (!rule.pattern.test(raw)) continue;
      if (isAllowedScanHit(scanPath, rule.key)) continue;
      hits.push(`${filePath}: ${rule.pattern}`);
    }
  });
  if (hits.length) throw new Error(`public boundary scan failed:\n${hits.join('\n')}`);
  console.log('public boundary scan passed');
}

function isAllowedScanHit(scanPath, ruleKey) {
  return ALLOWED_SCAN_HITS.get(scanPath)?.has(ruleKey) === true;
}

function marker(key, parts, joiner = '_') {
  return { key, pattern: new RegExp(parts.join(joiner), 'i') };
}

async function walk(dir, visit) {
  for (const entry of await readdir(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const info = await stat(full);
    if (info.isDirectory()) await walk(full, visit);
    else await visit(full);
  }
}
