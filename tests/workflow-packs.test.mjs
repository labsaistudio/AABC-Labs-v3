import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { validateWorkflow } from '../packages/core/src/validation/contract-validator.mjs';
import {
  REQUIRED_SOLANA_CAPABILITY_IDS,
  assertSolanaStackCoverage,
  solanaCapabilityIds,
} from '../packages/integrations/src/solana-capabilities.mjs';

test('all workflow packs are valid and declare source packages', async () => {
  const packs = await readdir('workflow-packs');
  assert.ok(packs.length >= 8);
  for (const pack of packs) {
    const workflow = JSON.parse(await readFile(join('workflow-packs', pack, 'workflow.json'), 'utf8'));
    assert.equal(validateWorkflow(workflow), true);
    assert.ok(workflow.sourcePackage.files.length > 0);
  }
});

test('solana capability registry covers the public stack', () => {
  assert.equal(assertSolanaStackCoverage(), true);
});

test('workflow packs reference registered solana capabilities', async () => {
  const registered = new Set(solanaCapabilityIds());
  const used = new Set();
  for (const pack of await readdir('workflow-packs')) {
    const workflow = JSON.parse(await readFile(join('workflow-packs', pack, 'workflow.json'), 'utf8'));
    assert.equal(workflow.ecosystem?.chain, 'solana');
    assert.ok(workflow.ecosystem.capabilities.length > 0);
    for (const capability of workflow.ecosystem.capabilities) {
      assert.equal(registered.has(capability), true, `${workflow.id}:${capability}`);
      used.add(capability);
    }
  }
  for (const capability of REQUIRED_SOLANA_CAPABILITY_IDS) {
    assert.equal(used.has(capability), true, `missing workflow coverage:${capability}`);
  }
});
